<?php
$oldid = $_POST['oldId'];
$id = $_POST['id'];
$title = $_POST['title'];
$category = $_POST['category'];
$notes = $_POST['notes'];
$position = $_POST['position'];
$posObj = json_decode($position);


$lat = $posObj->lat;
$lng = $posObj->lng;


echo "editing..";

$file = file_get_contents('./locations.json', true);
$data = json_decode($file, true);
unset($file);





$newObject[] = array('id' => (int)$id, 'type' => $category, 'title' => $title,  'notes' => $notes, 'lat' => (float)$lat, 'lng' => (float)$lng);




// Find the object with the specified ID
foreach ($data as &$object) {
    if ($object['id'] == $oldid) {
        $object['id'] = $id;
        $object['title'] = $title;
        $object['type'] = $category;
        $object['notes'] = $notes;
        $object['lat'] = $lat;
        $object['lng'] = $lng;
        break;
    }
}
//you need to add new data as next index of data.

$result = json_encode($data);
file_put_contents('./locations.json', $result);
unset($result);

echo "Update! bye";
header("refresh:2;url=config.php");
