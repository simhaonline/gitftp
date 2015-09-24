<?php

Class DeployHelper {

    // create user & repo folder.
    public function createFolders() {
        $this->output('Creating folders');
        exec("mkdir " . $this->repo_home . "/" . $this->user_id);
        $this->user_dir = $this->repo_home . "/" . $this->user_id;
        exec("mkdir " . $this->user_dir . "/" . $this->deploy_id);
        $this->repo_dir = $this->user_dir . "/" . $this->deploy_id;
    }

    // return clone url.
    public function clone_url() {
        return $this->gitapi->parseRepositoryCloneUrl($this->data, $this->provider);
    }

    // output.
    public function output($message, $color = 'black', $bgcolor = 'green') {
        if ($this->debug) {
            if (is_array($message)) {
                $message = print_r($message, TRUE);
            }
            if ($this->writefile && is_writeable($this->writefile)) {
                $file = $this->logfile;
                $current = file_get_contents($file);
                $current .= "$message\n";
                file_put_contents($file, $current);
            }

            \Cli::write("~ $message", $color, $bgcolor);
        }
    }

    /**
     * Filter ignore files
     *
     * @param array $files Array of files which needed to be filtered
     * @return Array with `files` (filtered) and `filesToSkip`
     */
    public function filterIgnoredFiles($files) {
        $filesToSkip = array();

        foreach ($files as $i => $file) {
            $matched = FALSE;
            foreach ($this->filesToInclude as $pattern) {
                if ($this->patternMatch($pattern, $file)) {
                    $matched = TRUE;
                    break;
                }
            }
            if (!$matched) {
                unset($files[$i]);
                $filesToSkip[] = $file;
                continue;
            }
            foreach ($this->filesToIgnore as $pattern) {
                if ($this->patternMatch($pattern, $file)) {
                    unset($files[$i]);
                    $filesToSkip[] = $file;
                    break;
                }
            }
        }

        $files = array_values($files);

        return array(
            'files'       => $files,
            'filesToSkip' => $filesToSkip
        );
    }

    // log it for the user.
    public function log($a, $b = NULL) {
        $this->output(isset($b) ? $b : $a);
        if (is_null($b)) {
            $this->log[] = $a;
        } else {
            $this->log[$a] = $b;
        }
    }

    /**
     * Executes a console command and returns the output (as an array)
     *
     * @return array of all lines that were output to the console during the command (STDOUT)
     */
    public function runCommand($command, $escape = TRUE) {
        // Escape special chars in string with a backslash
        if ($escape)
            $command = escapeshellcmd($command);
        $this->output("CONSOLE: $command");
        exec($command, $output);
        $this->output($output);

        return $output;
    }

    /**
     * Gets the current branch name.
     *
     * @return string - current branch name or false if not in branch
     */
    public function currentBranch() {
        $currentBranch = $this->gitCommand('rev-parse --abbrev-ref HEAD')[0];
        if ($currentBranch != 'HEAD') {
            return $currentBranch;
        }

        return FALSE;
    }


    /**
     * Purge given directory's contents
     *
     * @var string $purgeDirs
     */
    public function purge($purgeDirs) {
        foreach ($purgeDirs as $dir) {
            $origin = $this->connection->pwd();
            $this->connection->cd($dir);

            $this->output("Purging directory {$dir}");

            if (!$tmpFiles = $this->connection->ls()) {
                $this->output(" - Nothing to purge in {$dir}");
                $this->connection->cd($origin);
                continue;
            }

            $haveFiles = FALSE;
            $innerDirs = array();
            foreach ($tmpFiles as $file) {
                $curr = $this->connection->pwd();
                if ($this->connection->cd($file)) {
                    $innerDirs[] = $file;
                    $this->connection->cd($curr);
                } else {
                    $haveFiles = TRUE;
                    $this->output(" - {$file} is removed from directory");
                    $this->connection->rm($file);
                }
            }

            if (!$haveFiles) {
                $this->output(" - Nothing to purge in {$dir}");
            } else {
                $this->output("Purged {$dir}");
            }

            if (count($innerDirs) > 0) {
                $this->purge($innerDirs);
            }

            $this->connection->cd($origin);
        }
    }


    /**
     * Glob the file path
     *
     * @param string $pattern
     * @param string $string
     */
    public function patternMatch($pattern, $string) {
        return preg_match("#^" . strtr(preg_quote($pattern, '#'), array('\*' => '.*', '\?' => '.')) . "$#i", $string);
    }


    /**
     * Return a human readable filesize
     *
     * @param int $bytes
     * @param int $decimals
     */
    public function humanFilesize($bytes, $decimals = 2) {
        $sz = 'BKMGTP';
        $factor = floor((strlen($bytes) - 1) / 3);

        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
    }

    /**
     * Checks for deleted directories. Git cares only about files.
     *
     * @param array $filesToDelete
     */
    public function hasDeletedDirectories($filesToDelete) {
        $dirsToDelete = [];
        foreach ($filesToDelete as $file) {

            // Break directories into a list of items

            $parts = explode("/", $file);
            // Remove files name from the list
            array_pop($parts);

            foreach ($parts as $i => $part) {

                $prefix = '';
                // Add the parent directories to directory name
                for ($x = 0; $x < $i; $x++) {
                    $prefix .= $parts[$x] . '/';
                }

                // Relative path won't work consistently, thus getcwd().
                $part = getcwd() . '/' . $prefix . $part;

                // If directory doesn't exist, add to files to delete
                if (!is_dir($part)) {
                    $dirsToDelete[] = $part;
                }
            }
        }

        // Remove duplicates
        $dirsToDeleteUnique = array_unique($dirsToDelete);

        // Reverse order to delete inner children before parents
        $dirsToDeleteOrder = array_reverse($dirsToDeleteUnique);

        return $dirsToDeleteOrder;
    }


    /**
     * Runs a git command and returns the output (as an array)
     *
     * @param string $command "git [your-command-here]"
     * @param string $repoPath Defaults to $this->repo
     * @return array Lines of the output
     */
    public function gitCommand($command, $repoPath = NULL) {
        if (!$repoPath) {
            $repoPath = getcwd();
        }

        $command = 'git --git-dir="' . $repoPath . '/.git" --work-tree="' . $repoPath . '" ' . $command;

        return $this->runCommand($command, ($repoPath === FALSE) ? FALSE : NULL);
    }

    // start in bg
    public static function deploy_in_bg($deploy_id) {
        // todo: update this.
        shell_exec('FUEL_ENV=' . \Fuel::$env . ' php /var/www/html/oil refine crontask:deploy ' . $deploy_id . ' > /dev/null 2>/dev/null &');

        return TRUE;
    }

}