<?php

class Sendmail {
    
    private $instance;
    private $toUser;
    
    public function __construct() {
        $this->instance = Email::forge();
        return $this;
    }
    
    public function send() {
        
        $email->to('bonifacepereira@outlook.com', 'Boniface Pereira');
        $email->subject('This is the subject');
        $email->html_body(View::forge('email/signup'));
        
        try {
            $email->send();
        } catch (\EmailValidationFailedException $e) {
            return false;
        } catch (\EmailSendingFailedException $e) {
            return false;
        }
        return true;
        
    }

}
