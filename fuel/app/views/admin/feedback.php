<a class="btn btn-default disabled" href="<?php echo \Uri::create('administrator/feedback') ?>">General feedback</a>
<a class="btn btn-default" href="<?php echo \Uri::create('administrator/feedback/page') ?>">Page feedback</a>
<div style="height: 10px"></div>
<div class="panel panel-default">
    <div class="panel-heading">
        Feedback
    </div>
    <table class="table table-condensed table-bordered">
        <tr>
            <th>
                ID
            </th>
            <th>
                User_id
            </th>
            <th>
                Username
            </th>
            <th style="width: 30%">
                Feedback
            </th>
            <th>
                Date
            </th>
        </tr>

        <?php foreach ($feedback as $f) { ?>
            <tr>
                <td>
                    <?php echo $f['id']; ?>
                </td>
                <td>
                    <?php echo $f['user_id']; ?>
                </td>
                <td>
                    <a href="<?php echo Uri::create('administrator/user', array(), array(
                        'value' => $f['user_id']
                    )) ?>"><?php echo $f['username']; ?></a>
                </td>
                <td>
                    <?php echo $f['message']; ?>
                </td>
                <td>
                    <?php echo Date::forge($f['date'])->format('%m/%d/%Y %H:%M'); ?>
                </td>
                <td class="text-center">
                    <span class="delete" data-id="<?php echo $f['id']; ?>">Delete</span>
                </td>
            </tr>
        <?php } ?>
    </table>
</div>

<script>
    $('span.delete').click(function () {
        if (!confirm('sure?'))
            return false;
        var t = $(this);
        var id = $(this).attr('data-id');
        $.get('feedback/delete/' + id, function (data) {
            t.html('Deleted');
        })
    });
</script>