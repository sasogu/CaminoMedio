<?php
header('Content-Type: application/json');

$directory = 'mp3';
$files = array();

// Obtener todos los archivos .mp3
if (is_dir($directory)) {
    $scanned_files = scandir($directory);
    foreach ($scanned_files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'mp3') {
            $files[] = $file;
        }
    }
}

// Devolver la lista de archivos en formato JSON
echo json_encode($files);
?>
