<?php


$id = $_GET['id'];
if (!$id) {
    echo 'error! bye';
    header("refresh:2;url=config.html");
    return;
}

$file = file_get_contents('./locations.json', true);
$data = json_decode($file, true);



// Find the index of the object with the specified ID
$index = null;
foreach ($data as $key => $value) {
    if ($value['id'] == $id) {
        $index = $key;
        break;
    }
}

// Remove the object if found
if ($index !== null) {
    unset($data[$index]);
}

// Re-index the array to fill the gap left by the removed object
$data = array_values($data);
$result = json_encode($data);
file_put_contents('./locations.json', $result);

echo "removed from list! bye";
header("refresh:2;url=config.php");
