<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Config</title>
	<script src="https://kit.fontawesome.com/90370776df.js" crossorigin="anonymous"></script>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous" />

	<script src="js/libs/jquery-min.js"></script>
	<!-- Datatabels -->
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs5/jq-3.6.0/dt-1.12.1/datatables.min.css" />
	<script type="text/javascript" src="https://cdn.datatables.net/v/bs5/jq-3.6.0/dt-1.12.1/datatables.min.js"></script>
	<script type="module" src="js/config.js"></script>
</head>

<body>
	<div class="container">
		<br /><br />
		<?php


		function checkUniqueIds($array)
		{
			$idCount = array_count_values(array_column($array, 'id'));
			foreach ($idCount as $id => $count) {
				if ($count > 1) {
					return false; // Es gibt eine ID, die mehr als einmal vorkommt
				}
			}
			return true; // Alle IDs kommen nur einmal vor
		}

		$file = file_get_contents('./locations.json', true);
		$data = json_decode($file, true);

		// Überprüfen der Eindeutigkeit der IDs
		$isUnique = checkUniqueIds($data);

		if (!$isUnique) {
			echo '<div class="alert alert-danger" role="alert">ACHTUNG! IDs kommen mehrmals vor!!!</div>';
		}

		?>
		<br />

		<h1 class="text-center">Markers</h1>
		<a class="btn btn-outline-info m-1" data-bs-toggle="modal" data-bs-target="#add"><i class="fa fa-plus"></i></a>
		<!-- Modal -->
		<div class="modal fade" id="add" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="exampleModalLabel">Create Marker</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form action="./add.php" method="post">
							<div class="mb-3">
								<label for="id" class="form-label">ID</label>
								<input type="number" min="1" class="form-control" id="id" name="id" />
							</div>
							<div class="mb-3">
								<label for="id" class="form-label">Category</label>
								<select class="form-select" name="category" required>
									<option>Gangs</option>
									<option>Squads</option>
									<option>Police</option>
									<option>WT Spots</option>
									<option>DT Abgaben</option>
									<option>A. Helikopter</option>
									<option>Gang Dealer</option>
									<option>Händler</option>
									>
								</select>
							</div>
							<div class="mb-3">
								<label for="id" class="form-label">Title</label>
								<input type="text" class="form-control" id="id" name="title" placeholder="" required />
							</div>
							<div class="mb-3">
								<label for="id" class="form-label">Notes:</label>
								<input type="tex" class="form-control" id="id" name="notes" placeholder="Farbe: .." />
							</div>
							<div class="mb-3">
								<label for="id" class="form-label">Position</label>
								<input type="text" class="form-control" id="id" name="position" placeholder='{"lat": "73.746", "lng": "-121.157"}' required />
							</div>
							<button type="submit" class="btn btn-primary">Add</button>
						</form>
					</div>
				</div>
			</div>
		</div>
		<a class="btn btn-outline-info m-1" data-bs-toggle="modal" data-bs-target="#info"><i class="fa fa-question"></i></a>
		<!-- Modal -->
		<div class="modal fade" id="info" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="exampleModalLabel">Info</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">Gangs: 1-50<br />Police: 51-60<br>DT:61-65<br />Squads:100-200<br />A. Heli 200-250<br>WT 300-350<br>Gang Dealer 251-299</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary">Save changes</button>
					</div>
				</div>
			</div>
		</div>
		<br /><br />
		<table class="table table-striped" id="datatables">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Category</th>
					<th scope="col">Title</th>
					<th scope="col">Notes</th>
					<th scope="col">Position</th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody id="data">
				<?php
				foreach ($data as $key) {
				?>
					<tr>
						<th><?php echo $key['id']; ?></th>
						<td><?php echo $key['type']; ?></td>
						<td><?php echo $key['title']; ?></td>
						<td><?php echo $key['notes']; ?></td>
						<td><?php echo $key['lat']; ?> | lng: <?php echo $key['lng']; ?></td>
						<td> <a class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#edit<?php echo $key['id']; ?>"><i class="fa fa-edit"></i></a>
							<div class="modal fade" id="edit<?php echo $key['id']; ?>" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
								<div class="modal-dialog">
									<div class="modal-content">
										<div class="modal-header">
											<h1 class="modal-title fs-5" id="exampleModalLabel">Create Marker</h1> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
										</div>
										<div class="modal-body">
											<form action="./edit.php" method="post"> <input type="hidden" name="oldId" value="<?php echo $key['id']; ?>" />
												<div class="mb-3"> <label for="id" class="form-label">ID</label> <input type="number" min="1" class="form-control" value="<?php echo $key['id']; ?>" id="id" name="id" required /> </div>
												<div class="mb-3"> <label for="id" class="form-label">Category</label> <select class="form-select" name="category" required>
														<option <?php if ($key['type'] == 'Gangs') echo 'selected'; ?>>Gangs</option>
														<option <?php if ($key['type'] == 'Squads') echo 'selected'; ?>>Squads</option>
														<option <?php if ($key['type'] == 'Police') echo 'selected'; ?>>Police</option>
														<option <?php if ($key['type'] == 'WT Spots') echo 'selected'; ?>>WT Spots</option>
														<option <?php if ($key['type'] == 'DT Abgaben') echo 'selected;' ?>>DT Abgaben</option>
														<option <?php if ($key['type'] == 'A. Helikopter') echo 'selected'; ?>>A. Helikopter</option>
														<option <?php if ($key['type'] == 'Gang Dealer') echo 'selected'; ?>>Gang Dealer</option> >
														<option <?php if ($key['type'] == 'Händler') echo 'selected'; ?>>Händler</option> >
													</select> </div>
												<div class="mb-3"> <label for="id" class="form-label">Title</label> <input type="text" class="form-control" id="id" name="title" value="<?php echo $key['title']; ?>" placeholder="" required /> </div>
												<div class="mb-3"> <label for="id" class="form-label">Notes:</label> <input type="tex" class="form-control" id="id" name="notes" value="<?php echo $key['notes']; ?>" placeholder="Farbe: .." /> </div>
												<div class="mb-3"> <label for="id" class="form-label">Position</label> <input type="text" class="form-control" id="id" name="position" value='{"lat": "<?php echo $key['lat']; ?>", "lng": "<?php echo $key['lng']; ?>"}' placeholder='{"lat": "73.746", "lng": "-121.157"}' required /> </div> <button type="submit" class="btn btn-primary">Update</button>
											</form>
										</div>
									</div>
								</div>
							</div> <a class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#delete<?php echo $key['id']; ?>"><i class="fa fa-times"></i></a> <!-- Modal -->
							<div class="modal fade" id="delete<?php echo $key['id']; ?>" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
								<div class="modal-dialog">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLabel">Marker Löschen??</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
										</div>
										<div class="modal-body">Willst du den Marker <b><?php echo $key['title']; ?></b> wirklich löschen?</div>
										<div class="modal-footer"> <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button> <button type="button" onclick="window.location.href='./remove.php?id=<?php echo $key['id']; ?>'" class="btn btn-danger">Löschen</button> </div>
									</div>
								</div>
							</div>
						</td>
					</tr>
				<?php
				}
				?>
			</tbody>
		</table>
	</div>
	<script>
		$(document).ready(function() {
			$('#datatables').DataTable({
				pageLength: 15,
				lengthMenu: [
					[15, 50, 100, -1],
					[15, 50, 100, 'Alle'],
				],
				language: {
					url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json',
				},
				order: [
					[0, 'asc']
				],
			});
		});
	</script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
</body>

</html>