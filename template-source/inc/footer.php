<?php 
$db = new Database();
$contact = "select * FROM contact";
$con = $db->select($contact);

$soc = "select * FROM social";
$social = $db->select($soc);

$sectors = "select * FROM sectors";
$sec = $db->select($sectors);


if($con){
  $data=$con->fetch_assoc();
  $sector=$sec->fetch_assoc();
  $social_link=$social->fetch_assoc();
?>
  <!-- ======= Footer ======= -->
  <footer id="footer" class="footer">

    <div class="footer-content position-relative">
      <div class="container">
        <div class="row">

          <div class="col-lg-4 col-md-6">
            <div class="footer-info">
              <h3><?php echo $data['company_title']; ?></h3>
              <p><?php echo $data['address']; ?> <br><br>
                <strong>Phone:</strong> <?php echo $data['cell']; ?> <br>
                <strong>Email:</strong> <?php echo $data['email']; ?> <br>
              </p>
              <div class="social-links d-flex mt-3">
                <a href="<?php echo $social_link['fb']; ?>" class="d-flex align-items-center justify-content-center"><i class="<?php echo $social_link['fb_icon']; ?>"></i></a>
                <a href="<?php echo $social_link['linkedin']; ?>" class="d-flex align-items-center justify-content-center"><i class="<?php echo $social_link['linkedin_icon']; ?>"></i></a>
              </div>
            </div>
          </div><!-- End footer info column-->

          <div class="col-lg-2 col-md-3 footer-links">
            <h4>Links</h4>
            <ul>
              <li><a href="index.php">Home</a></li>
              <li><a href="about.php">About</a></li>
              <li><a href="services.php">Services</a></li>
              <li><a href="projects.php">Projects</a></li>
              <li><a href="blog.php">Blog</a></li>
              <li><a href="contact.php">Contact</a></li>
            </ul>
          </div><!-- End footer links column-->

          <div class="col-lg-3 col-md-4 footer-links">
            <h4>Our Services</h4>
            <ul>
            <?php while ($sector=$sec->fetch_assoc()) { ?>
              <li><a href="service_details.php?id=<?php echo $sector['id']; ?>"><?php echo $sector['name']; ?></a></li>
            <?php } ?>
            </ul>
          </div><!-- End footer links column-->
        </div>
      </div>
    </div>

    <div class="footer-legal text-center position-relative">
      <div class="container">
        <div class="copyright">
          &copy; Copyright <strong><span><?php echo $data['company_title']; ?></span></strong>. All Rights Reserved
        </div>
        <div class="credits">
          <!-- All the links in the footer should remain intact. -->
          <!-- You can delete the links only if you purchased the pro version. -->
          <!-- Licensing information: https://bootstrapmade.com/license/ -->
          <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/ -->
          Designed & Developed by <a href="">Cozmic</a>
        </div>
      </div>
    </div>

  </footer>
 <?php } else{header("Location:404.php");} ?>