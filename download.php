<?php

$file = $_GET['file'];

header('Content-type: audio/mpeg');

header('Content-Disposition: attachment; filename="'.$file.'"');

?>
