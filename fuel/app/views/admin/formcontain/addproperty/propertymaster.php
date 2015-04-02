<div class="row">
    <div class="col-lg-3">
        <label>Builder Name</label>
        <select class="form-control" name="builder_name" placeholder="Property Bed">
            <option value="">-select-</option>
            <?php
            foreach ($builder as $key => $value) {
                echo '<option value="' . $value['builder_id'] . '">' . $value['builder_name'] . '</option>';
            }
            ?>
        </select>                      
    </div>

    <div class="col-lg-3">
        <label>Property Name</label>
        <input class="form-control" name="property_name" placeholder="Property Name">                              
    </div>

    <div class="col-lg-3">
        <label>Property Status</label>
        <select class="form-control" name="property_conduction" placeholder="Property Bed">
            <option value="">-select-</option>
            <option value="1">Pre-launch</option>
            <option value="2">Under Construction</option>
            <option value="3">Ready Possession</option>
        </select>                              
    </div>

    <div class="col-lg-3">
        <label>Property Type</label>
        <select class="form-control" name="property_type" placeholder="Property Bed">
            <option value="">-select-</option>
            <option value="1">Flat</option>
            <option value="2">Project</option>
            <option value="3">Bunglow</option>
            <option value="4">Commerical</option>
            <option value="5">Shop</option>
        </select> 
    </div>

</div>
<div style="height: 10px;"></div>
<div class="row">
    <div class="form-group">
        <div class="col-lg-3">
            <label>Property Location</label>
            <select class="form-control" name="location" placeholder="Property Bed">
                <option value="">-select-</option>
                <?php
                foreach ($location as $key => $value) {
                    echo '<option value="' . $value['location_Id'] . '">' . $value['locality_name'] . '</option>';
                }
                ?>
            </select>                    
        </div>

        <div class="col-lg-3">
            <label>Property Address</label>
            <textarea class="form-control" name="property_address" placeholder="Property Address"></textarea>
        </div>
        <div class="col-lg-3">
            <label>Sector</label>
            <input class="form-control" name="property_sector" placeholder="Sector">                     
        </div>
        <div class="col-lg-3">
            <label>Property Desc</label>
            <textarea class="form-control" name="property_desc" placeholder="Property Desc"></textarea>
        </div>

    </div>
</div>

<div style="height: 10px;"></div>
<div class="row">
    <div class="form-group">

        <div class="col-lg-3">
            <label>Project Details</label>
            <input class="form-control" name="project_details" placeholder="Project Details Ex 1, 2 BHK">                     
        </div>
        <!--        <div class="col-lg-3">
                    <label>Floor No</label>
                    <select class="form-control" name="floorno" placeholder="Property Bed">
                        <option value="">-select-</option>
                        <option>Ground Floor</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>                      
                </div>-->
        <div class="col-lg-3">
            <label>Price</label><br>
            <input type="text" name="property_price" class="form-control" placeholder="25 - 70 Lacs or 80 Lacs" >
        </div>
        <div class="col-lg-3">
            <label>Property Area</label>
            <input class="form-control" name="property_area" placeholder="Area 500 to 9000 Sp. Ft" >                 
        </div>
        <div class="col-lg-3">
            <label>Possesion date</label><br>
            <input type="date" name="possesion_date" class="form-control">
        </div>
    </div>
</div>
<div style="height: 10px;"></div>
<div class="row">
    <div class="form-group">
        <div class="col-lg-3">
            <label>Feature Project</label><br>
            <input type="checkbox" name="featured_property" value="Yes">
        </div>
    </div>
</div>