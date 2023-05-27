import locations from '../locations.json' assert {type: 'json'};

window.onload = init();
function init() {
	var tableData = '';
	locations.forEach((loc) => {
		tableData += `<tr>
					<th>${loc.id}</th>
					<td>${loc.type}</td>
					<td>${loc.title}</td>
					<td>${loc.notes}</td>
					<td>lat: ${loc.lat} | lng: ${loc.lng}</td>
					<td>
                    <a  class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#edit${loc.id}"><i class="fa fa-edit"></i></a>
                    <div class="modal fade" id="edit${loc.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		            	<div class="modal-dialog">
		            		<div class="modal-content">
		            			<div class="modal-header">
		            				<h1 class="modal-title fs-5" id="exampleModalLabel">Create Marker</h1>
		            				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		            			</div>
		            			<div class="modal-body">
		            				<form action="./edit.php" method="post">
                                        <input type="hidden" name="oldId" value="${loc.id}" />
		            					<div class="mb-3">
		            						<label for="id" class="form-label">ID</label>
		            						<input type="number" min="1" class="form-control" value="${loc.id}" id="id" name="id" required />
		            					</div>
		            					<div class="mb-3">
		            						<label for="id" class="form-label">Category</label>
		            						<select class="form-select" name="category" required>
		            							<option ${loc.type == 'Gangs' ? 'selected' : ''}>Gangs</option>
		            							<option ${loc.type == 'Squads' ? 'selected' : ''}>Squads</option>
		            							<option ${loc.type == 'Police' ? 'selected' : ''}>Police</option>
		            							<option ${loc.type == 'WT Spots' ? 'selected' : ''}>WT Spots</option>
		            							<option ${loc.type == 'DT Abgaben' ? 'selected' : ''}>DT Abgaben</option>
		            							<option ${loc.type == 'A. Helikopter' ? 'selected' : ''}>A. Helikopter</option>
		            							<option ${loc.type == 'Händler' ? 'selected' : ''}>Händler</option>
		            							>
		            						</select>
		            					</div>
		            					<div class="mb-3">
		            						<label for="id" class="form-label">Title</label>
		            						<input type="text" class="form-control" id="id" name="title" value="${loc.title}" placeholder="" required />
		            					</div>
		            					<div class="mb-3">
		            						<label for="id" class="form-label">Notes:</label>
		            						<input type="tex" class="form-control" id="id" name="notes" value="${loc.notes}" placeholder="Farbe: .." />
		            					</div>
		            					<div class="mb-3">
		            						<label for="id" class="form-label">Position</label>
		            						<input type="text" class="form-control" id="id" name="position" value='{"lat": "${loc.lat}", "lng": "${
			loc.lng
		}"}' placeholder='{"lat": "73.746", "lng": "-121.157"}' required />
		            					</div>
		            					<button type="submit" class="btn btn-primary">Update</button>
		            				</form>
		            			</div>
		            		</div>
		            	</div>
		            </div>      
                    <a class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#delete${loc.id}"><i class="fa fa-times"></i></a>
                    <!-- Modal -->
                    <div class="modal fade" id="delete${loc.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Marker Löschen??</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">Willst du den Marker <b>${loc.title}</b> wirklich löschen?</div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
                                    <button type="button" onclick="window.location.href='./remove.php?id=${loc.id}'" class="btn btn-danger">Löschen</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </td>
				</tr>`;
	});

	$('#data').html(tableData);
}
