-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2026 at 02:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cozmictech`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us`
--

CREATE TABLE `about_us` (
  `id` int(11) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `est` varchar(15) DEFAULT NULL,
  `happy_icon` varchar(30) DEFAULT NULL,
  `happy_client` int(5) DEFAULT NULL,
  `projects_icon` varchar(30) DEFAULT NULL,
  `project_nos` int(5) DEFAULT NULL,
  `support_icon` varchar(30) DEFAULT NULL,
  `hrs_support` int(8) DEFAULT NULL,
  `emp_icon` varchar(30) DEFAULT NULL,
  `emp_nos` int(3) DEFAULT NULL,
  `story_title` varchar(50) DEFAULT NULL,
  `story_body` text DEFAULT NULL,
  `story_body2` varchar(255) DEFAULT NULL,
  `mission_title` varchar(50) DEFAULT NULL,
  `mission_body` text DEFAULT NULL,
  `vision_title` varchar(50) DEFAULT NULL,
  `vision_body` text DEFAULT NULL,
  `values_title` varchar(50) DEFAULT NULL,
  `values_body` int(11) DEFAULT NULL,
  `team_title` varchar(30) DEFAULT NULL,
  `team_description` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about_us`
--

INSERT INTO `about_us` (`id`, `tagline`, `est`, `happy_icon`, `happy_client`, `projects_icon`, `project_nos`, `support_icon`, `hrs_support`, `emp_icon`, `emp_nos`, `story_title`, `story_body`, `story_body2`, `mission_title`, `mission_body`, `vision_title`, `vision_body`, `values_title`, `values_body`, `team_title`, `team_description`) VALUES
(1, 'Together to Build a Better Future.', 'EST 2020', 'bi bi-emoji-smile', 35, 'bi bi-journal-richtext', 54, 'bi bi-stopwatch', 26, 'bi bi-people', 38, 'Our Story', 'Cozmic Technology is a Bangladeshi Incorporated engineering firm. We are dedicated to delivering innovative and sustainable solutions for the design and construction of buildings and infrastructure. We have a team of experienced and highly-skilled engineers, project managers, and construction professionals who are committed to delivering high-quality services to our clients.\n\nWith a focus on safety, sustainability, and quality, we strive to provide our clients with the best possible outcomes for their projects. Our extensive experience and expertise allow us to tackle complex projects and deliver results that meet our clients\' needs and exceed their expectations.\n\nWe are committed to staying at the forefront of industry developments and continually improving our processes and procedures to deliver the highest quality services to our clients. Whether you are planning a new construction project or looking to improve existing infrastructure, our team is here to help you achieve your goals.\n', 'we believe in building strong relationships with our clients and working together to create better outcomes. We are dedicated to delivering excellence in everything we do, and we are committed to providing our clients with the support and guidanc', 'MISSION', 'To establish Cozmic Technology as a trusted, reliable and top-tier provider of engineering consultancy and geotechnical investigation services in the region. We strive to help our clients execute their projects safely and efficiently.', 'VISION', 'To be the most premium engineering consulting firm, leading with innovation and sustainable designs. We envision transforming construction environments and empowering clients with top-of-the-line structural, civil, and environmental engineering solutions.', 'VALUES', 0, 'Our Team', 'Comprised of experts in a variety of fields, including Architectural, Civil, Environmental Sustainability, our team is dedicated to providing innovative and sustainable solutions that meet the needs of our clients and the environment. Our team always committed to delivering solutions that are safe, sustainable, and economically viable.');

-- --------------------------------------------------------

--
-- Table structure for table `career`
--

CREATE TABLE `career` (
  `id` int(11) NOT NULL,
  `post` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `image` varchar(100) NOT NULL,
  `vacancy` int(3) NOT NULL,
  `emp_status` varchar(50) NOT NULL DEFAULT 'Full-Time',
  `experience` varchar(100) DEFAULT NULL,
  `salary` varchar(25) NOT NULL DEFAULT 'Negotiable',
  `gender` varchar(10) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `description` text NOT NULL,
  `responsibilities` text NOT NULL,
  `Edu_Qlty` varchar(255) NOT NULL,
  `other_beninifs` text DEFAULT NULL,
  `published` date NOT NULL,
  `status` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `career`
--

INSERT INTO `career` (`id`, `post`, `location`, `image`, `vacancy`, `emp_status`, `experience`, `salary`, `gender`, `deadline`, `description`, `responsibilities`, `Edu_Qlty`, `other_beninifs`, `published`, `status`) VALUES
(1, 'Project Manager', 'Dhaka, Bangladesh', 'career1.jpg', 5, 'Full-Time', '5 years in any engineering consultancy organization as a Project Manager', 'Negotiable', 'Any', '2026-07-10', 'A Construction Project Manager collaborates with Engineers and Supervisors in planning, budgeting, allocating resources, and providing timely completion of the project. They also ensure that the project is completed within the set budget and is within the scope. Additionally, they ensure the project delivers the expected results and benefits.', 'Planning the work to be done, getting the necessary personnel, and assigning the right duties to the right people\nHiring the right people and putting them on the right sites, as well as reprimanding and firing workers when needed\nCoordinating tasks by different people on different sites to ensure uniformity upon project completion\nEnsuring timely completion of the project to build client trust while avoiding unnecessary penalties\nWorking within the budget by adequately estimating the costs and cutting unnecessary expenses\nProcuring and allocating resources to ensure there is no shortage while avoiding any unnecessary delays caused by management decisions\nManaging both internal and external risks within the project’s lifetime, such as poor planning designs, and government policies, which directly or indirectly affect the project ', 'MBA form any reputed University', 'To be a certified Construction Project Manager, the candidate may hold a bachelor’s degree in construction project management or a construction-related field such as civil engineering or architecture. This degree choice provides the skills, experiences, and knowledge to succeed in their new role. For example, they may take courses in construction materials, labor laws, project planning, and construction management.', '2023-02-07', 'Active'),
(2, 'Quantity Surveyor', 'Dhaka, Bangladesh', 'career1.jpg', 3, 'Full-Time', '5-10 years of general construction estimating experience, financial experience, construction experie', 'Negotiable', 'Any', '2023-02-23', 'We are seeking a skilled, reliable, efficient quantity surveyor to join our growing organization. In this position, you will estimate the costs of construction projects, working with contractors, builders, and architects to provide the most cost-effective plans that meet high-quality standards. You must have strong organizational and communication skills in order to manage and direct development plans.', 'Able to analyze financial records and apply data to improved results\r\n<br>* Strong aptitude for numbers, spreadsheets, and financial reports\r\n<br>* Experienced at compiling and following strict budgets; strong estimating and financial analysis skills\r\n<br>* In-depth understanding of construction, materials, pricing, and industry\r\n<br>* Able to analyze problems and strategize for better solutions', 'Bachelor\'s degree in quantity surveying, construction engineering, management, or related field.', 'To be successful as a quantity surveyor, you should have a methodical approach and superb interpersonal skills. Outstanding quantity surveyors are not only great at analyzing costs, but they also know how to read people and tailor their negotiation strategies to ensure the best possible outcome.\r\n', '2023-02-07', 'Inactive');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Commercial'),
(2, 'Drainage'),
(3, 'Education'),
(4, 'Energy Storage System'),
(5, 'Godown'),
(6, 'Healthcare'),
(7, 'Highrise'),
(8, 'Industrial'),
(9, 'Mixed-Use'),
(10, 'Religious'),
(11, 'Renewable'),
(12, 'Renovation'),
(13, 'Residential'),
(14, 'Sewerage'),
(15, 'Solar'),
(16, 'Sewerage'),
(17, 'Terminals & Jetties'),
(18, 'Waste Water'),
(19, 'Water Supply'),
(20, 'Power plant'),
(21, 'Sub-Station');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `client_cat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_name`, `logo`, `country`, `email`, `phone`, `location`, `client_cat`) VALUES
(1, 'TBEA Co. Ltd.', '09592083-d8cc-4ea8-a6fe-e7c80567df14.jpg', 'China', 'info@tbea.com', '+86-994-6508838', 'Changji, Changji Hui Autonomous Prefecture, China', 1),
(2, 'Adobe Builders Ltd.', '111a8568-cca2-4d98-9b50-064c9866f28e.jpg', 'Bangladesh', 'info@theadobebuilders.com', '02-8833825', 'House-23, Road-121, Gulshan-1, Dhaka 1212', 1),
(5, 'Anlima Energy Ltd.', 'df1aba49-fe6a-4460-b915-a92f99a83572.jpg', 'Bangladesh', NULL, NULL, 'Dhaka, Bangladesh', 1),
(6, 'Confidence Power Ltd.', '515b947f-a6ef-4966-84d0-3b9d0a8bdc33.png', 'Bangladesh', NULL, NULL, 'Dhaka', 1),
(8, 'KSRM', '74d86a33-8d1f-4df8-8c05-0b0825b9ad97.png', 'Bangladesh', NULL, NULL, 'Dhaka, Bangladesh', 1),
(9, 'Desh Energy', 'b20f16e7-d9f7-4759-918e-6929c822e5b4.jpg', 'Bangladesh', NULL, NULL, 'Dhaka, Bangladesh', 1);

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `sec_title` varchar(30) NOT NULL,
  `company_title` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `cell` varchar(15) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `email2` varchar(100) DEFAULT NULL,
  `lat` varchar(15) DEFAULT NULL,
  `lon` varchar(15) DEFAULT NULL,
  `map` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `sec_title`, `company_title`, `address`, `phone`, `cell`, `email`, `email2`, `lat`, `lon`, `map`) VALUES
(1, 'Contact', 'Cozmic Technology', '3rd Floor, 1/1-A, 1/1-B, Adabor Bazar Road, Dhaka-1207, Bangladesh', '', '+8802223310777', 'info@cozmictech.com', 'ceo@cozmictech.com', '23.7623047', '90.366711', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.2790070836804!2d90.3599366!3d23.773077000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bfc90524ddbf%3A0xc085273d03463ccc!2sCozmic%20Technology!5e0!3m2!1sen!2sbd!4v1782976193960!5m2!1sen!2sbd');

-- --------------------------------------------------------

--
-- Table structure for table `homepage`
--

CREATE TABLE `homepage` (
  `id` int(11) NOT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `favicon` varchar(100) DEFAULT NULL,
  `company_title` varchar(255) DEFAULT NULL,
  `slogan` varchar(255) DEFAULT NULL,
  `glance_title` varchar(255) DEFAULT NULL,
  `glance_description` text DEFAULT NULL,
  `glance_img` varchar(255) DEFAULT NULL,
  `Exp_title` varchar(50) DEFAULT NULL,
  `exp_year` varchar(10) DEFAULT NULL,
  `pro_title` varchar(50) NOT NULL,
  `pro_nos` varchar(10) NOT NULL,
  `title1` varchar(100) DEFAULT NULL,
  `tag1` text DEFAULT NULL,
  `title2` varchar(100) DEFAULT NULL,
  `tag2` text DEFAULT NULL,
  `title3` varchar(100) DEFAULT NULL,
  `tag3` text DEFAULT NULL,
  `title4` varchar(100) DEFAULT NULL,
  `tag4` text DEFAULT NULL,
  `title5` varchar(100) DEFAULT NULL,
  `tag5` text DEFAULT NULL,
  `title6` varchar(100) DEFAULT NULL,
  `tag6` text DEFAULT NULL,
  `title7` varchar(100) DEFAULT NULL,
  `content7` varchar(1000) DEFAULT NULL,
  `image7` varchar(100) DEFAULT NULL,
  `title8` varchar(100) DEFAULT NULL,
  `content8` varchar(1000) DEFAULT NULL,
  `image8` varchar(100) DEFAULT NULL,
  `title9` varchar(50) DEFAULT NULL,
  `content9` varchar(1000) DEFAULT NULL,
  `image9` varchar(100) DEFAULT NULL,
  `theme` varchar(50) DEFAULT 'theme-default',
  `hero_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hero_images`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `homepage`
--

INSERT INTO `homepage` (`id`, `logo`, `favicon`, `company_title`, `slogan`, `glance_title`, `glance_description`, `glance_img`, `Exp_title`, `exp_year`, `pro_title`, `pro_nos`, `title1`, `tag1`, `title2`, `tag2`, `title3`, `tag3`, `title4`, `tag4`, `title5`, `tag5`, `title6`, `tag6`, `title7`, `content7`, `image7`, `title8`, `content8`, `image8`, `title9`, `content9`, `image9`, `theme`, `hero_images`) VALUES
(1, '', '', 'Cozmic Technology', 'Engineering Excellency', 'At a Glance', 'We are a Collective of Geotechnical Engineers Architects, Designers and Planners Working Together to Build a Better Future.\r\nWe work closely with our clients to interpret their dreams/visions accurately in drawings and bring them to the desired reality through construction solutions to meet their needs; We communicate with our clients throughout the construction process to keep them informed of progress and to ensure that our project kept on schedule and within budget.', 'glance.jpg', 'Years of Experience', '6+', 'Successful Projects', '52+', '', '', '', '', 'Services', 'We provide a broad assortment of geotechnical investigation, detail engineering consultancy, and project management services.', 'Our Strength', 'We have an experienced team of Geotechnical Engineers &amp; Architects. Our motive is to provide effective, efficient &amp; economical services.', 'Testimonials', 'Our clients come from a diverse range of industries and businesses, each with their own unique challenges and requirements. We take pride in providing tailored solutions that meet the specific needs of each client, resulting in high levels of satisfaction and positive feedback.', 'Recent Blog Posts', 'The latest industry trends and provides practical insights and tips to help you stay ahead of the curve. The post showcases our thought leadership and deep understanding of the topic. With actionable advice and a unique perspective, this post is for anyone looking to improve their work. The engaging and informative tone makes it a valuable resource for anyone.', 'Sustainable Engineering', 'Sustainable engineering is more than designing efficient systems it\'s about creating solutions that meet today\'s needs while protecting the environment and preserving resources for future generations. We combine engineering expertise with sustainable design principles to deliver practical, high-performance solutions. Every project is guided by careful planning, data-driven analysis, and a commitment to reducing environmental impact throughout the entire lifecycle.', 'sustainable.png', 'Building Technology', 'Advancements in technology have revolutionized the way to create more sustainable and efficient structures than ever before. From materials science to digital design and construction, technology has revolutionized the way we build, maintain, and operate our infrastructure.  We use Building Information Modeling (BIM) technology to create 3D models of their designs, simulating the entire construction process and identifying potential issues before they arise. This leads to improved safety and security, and it opens up new opportunities for creating smarter and more sustainable communities.', 'buildingtech.png', 'Join Our Team', 'Join our dynamic team of Cozmic Technology, where you will have the opportunity to work on innovative and challenging projects that make a positive impact on communities. Our firm values collaboration, creativity, and a commitment to excellence. We are seeking talented individuals who are passionate about design and problem-solving, and who want to grow their careers in a supportive and inclusive work environment. If you have a strong technical background, excellent communication skills, and a desire to make a difference, we would love to hear from you. Apply now to become a part of our team!\"', 'careerhome.png', 'theme-default', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `message_cat_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `company` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `message_cat_id`, `name`, `email`, `company`, `subject`, `message`, `status`, `date`) VALUES
(1, 2, 'mubinul', 'mubinulhq@gmail.com', 'Innovate Engineering Technology', 'Business Proposal', 'We would like to invite to an EOI for BEAZ', 1, '2023-02-06 07:59:46'),
(3, 2, 'Hamid Hossain', 'hadmi4587@gmail.com', 'DHP Group', 'Invitation fo Joinlty Submit a Proposal', 'We would like to invite you to jointy submit upcoming proposal on the feasibility study project for Nalka Gas distribution station.', 1, '2026-06-29 06:07:26');

-- --------------------------------------------------------

--
-- Table structure for table `message_category`
--

CREATE TABLE `message_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(50) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message_category`
--

INSERT INTO `message_category` (`id`, `category_name`, `active`) VALUES
(1, 'General Inquiry', 1),
(2, 'Business Proposal', 1),
(3, 'Investment', 1),
(4, 'Review', 1),
(5, 'Complaint', 1),
(6, 'Career', 1),
(7, 'Financial', 1),
(8, 'Service', 1),
(9, 'Event', 1);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `post_catid` int(2) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `author` varchar(50) DEFAULT NULL,
  `sdate` varchar(50) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `post_catid`, `title`, `content`, `image`, `author`, `sdate`, `date`) VALUES
(1, 1, 'Annual Townhall & New Year Event', '<p>The start of a new year is always a time to reflect and celebrate, and the Cozmic Technology is no exception. Every year, the organization holds an annual get together to bring together all members and reflect on the past year\'s achievements, as well as to look forward to the future.\r\n<br> <br> The event began with a warm welcome from the organization\'s leader, followed by a review of the year\'s accomplishments. The organization\'s members were proud to share their work and achievements, including new innovations and projects that have made a positive impact in the engineering field.\r\nThe event also provided an opportunity for members to network and exchange ideas. This year\'s theme was \"Innovation for a Better Future\", and members were encouraged to share their thoughts on how the organization can continue to drive innovation and make a positive impact in the coming year.\r\n<br><br> In addition to the annual get together, Cozmic Technology also celebrated the start of the new year with a special celebration. The event was a great success and everyone left feeling energized and inspired for the year ahead. Cozmic Technology is grateful for the hard work and dedication of its members, and is looking forward to another year of growth, innovation, and impact.\r\n<br> <br>In conclusion, the annual get together and happy new year celebration was a time to reflect on the past year\'s achievements and to look forward to the future. We are committed to driving innovation and making a positive impact in the coming year.</p>\r\n', 'townhall.jpg', 'Authority', '01-01-2023', '2023-03-09 05:03:55'),
(2, 3, ' Research & Development', 'The field of engineering is constantly evolving, and it is essential for organizations to stay ahead of the curve in order to stay relevant and competitive. One of the ways that the Cozmic Technology is doing this is through a new research and development initiative. This initiative is focused on fostering innovation and driving new solutions that will shape the future of the engineering field. The organization has dedicated significant resources to this effort, including funding and personnel, in order to make the most of this exciting opportunity. One of the key elements of the initiative is collaboration. The organization is working with top researchers, academics, and industry leaders to pool their knowledge and expertise, and to drive new solutions that will have a real impact. The goal is to create a dynamic community of innovators who can collaborate, share ideas, and drive progress in the field. The initiative is also focused on promoting diversity and inclusiveness. The organization recognizes the importance of bringing together people from different backgrounds and perspectives in order to drive new solutions and innovations. The initiative is committed to creating a diverse and inclusive environment that will encourage new ideas and perspectives. Cozmic Technology is also focused on creating a supportive environment for researchers and innovators. The initiative is designed to provide resources, mentorship, and training to help individuals achieve their full potential. The goal is to create a supportive and empowering community that will drive progress and advance the field.', 'research.jpg', 'Authority', '10-12-2022', '2026-06-29 10:16:19');

-- --------------------------------------------------------

--
-- Table structure for table `post_category`
--

CREATE TABLE `post_category` (
  `id` int(11) NOT NULL,
  `name` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_category`
--

INSERT INTO `post_category` (`id`, `name`) VALUES
(1, 'Event'),
(2, 'News'),
(3, 'General'),
(5, 'Presentation'),
(6, 'Award');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `sector_id` int(3) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `description` text NOT NULL,
  `status` enum('Ongoing','Completed') NOT NULL DEFAULT 'Completed',
  `services` text DEFAULT NULL,
  `project_cost` varchar(20) DEFAULT NULL,
  `service_cost` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `feature` varchar(255) NOT NULL,
  `story` varchar(20) DEFAULT NULL,
  `area` varchar(50) DEFAULT NULL,
  `height` varchar(25) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `sector_id`, `client_id`, `title`, `images`, `description`, `status`, `services`, `project_cost`, `service_cost`, `location`, `feature`, `story`, `area`, `height`, `end_date`, `start_date`) VALUES
(1, 3, 1, '21 Storied Sub-Station Office Building', '[\"tajgoan1.jpg\"]', 'Tejgaon is a highly sought-after commercial building that was designed for DPDC Investment and is located in the heart of Dhaka, near Tejgaon Business District. Situated on a rectangular plot within the urban fabric of contemporary office tower incorporates Grade-A offices with small scale retail in the entrance foyer. The podium is set in a tranquil garden abundant with local flora and provides a strong architectural focus that is both elegant and efficient. The louver skin facade of the podium was designed for creates a flotation free form that reflects modern traditions while delivering a functional elevation with natural ventilation. The 21-storey office tower & substation elevated above the podium is an energy efficient glass box and a light shelf allows natural light to penetrate into the office floor plate. The project for its innovation in sustainable design. Surrounded by a cluster of amenities within vibrant main Road, access into the site is direct and efficient through a vehicular drop-off and two levels of car parking.', 'Completed', '-Geo technical Investigation\r\n<br>-Design & reviewer of Architectural, Structural\r\n<br>-Pile load testing and report preparation\r\n<br>-Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'Tejgaon, Dhaka, Bangladesh', 'Office Building', '3B+21 Storied', '14139.68 sqm', '95.9 m', NULL, NULL),
(2, 3, 1, 'Green View', '[\"greenview1.jpg\"]', 'This is 10 Storied Residence Building\r\nand Total Height is 32 m. It\'s North-\r\nSouth Oriented. This Site is located in\r\nBanosree residential side. Simplicity\r\nbeing the essence, the project relates\r\nitself with the surrounding by\r\nchanneling a feel happy mood making\r\nthe nature as the ultimate source of\r\ninspirations. For greater comfort use\r\nlocal made bricks, brick louvers,\r\nwooden door, green facade etc. The\r\nnew vegetation pattern follows the\r\nexisting landscape with minimum\r\nintervention.', 'Completed', '-Geo technical Investigation\r\n<br>-Design & reviewer of Architectural, Structural\r\n<br>-Pile load testing and report preparation\r\n<br>-Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'Banosree, Dhaka, Bangladesh', 'Residential Building', '1B+10 Storied', '1190 sqm', '32 m', NULL, NULL),
(3, 3, 1, '132/33 kV Substation & Residence', '[\"kakrail1.jpg\"]', 'The epitome of the country\'s development towards \"modernization\", we refer to the model of a modern country to create a unique architectural residence art environment and facade style.This substation cum residence create a new era of modernization. The\r\nconcept of sustainable development integrates\r\narchitecture and environment to create a natural and\r\ncomfortable space microclimate. Energy conservation\r\nand emission reduction, control of excessive use of\r\nresources to flexible use and expandability', 'Completed', '-Geo technical Investigation\r\n<br>-Design & reviewer of Architectural, Structural\r\n<br>-Pile load testing and report preparation\r\n<br>-Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'Kakrail, Dhaka, Bangladesh', 'Substation and Residential Building', '3B+12 Storied', '45121 sqm', '58.8 m', NULL, NULL),
(4, 3, 1, '10 Storied Substation Cum Office Building at English Road.', '[\"englishroad1.jpg\",\"8d7a5011-bae4-4db5-b538-83a3fe7650a1.webp\"]', '<p>The gently regular rectangular form of this 12 story\nsubstation cum office building creating a beacon for\nperformance. Continuous at the office. The sheaths\nextend to the top of the tower, revealing a public\nobservation deck above organically shaped openings\nthat reduce wind pressure. The building has two\nbasement floors used for parking, storage,\nmechanical systems, and other operational functions\nto avoid disrupting people. Lifts for servicing the\nsubstation area and other staff needs were designed\nfor separate use to ensure efficient service. With the\ncareful planning of public areas, operational spaces\nand user flows, the design creates a building that is\nartistic, efficient and cost effective.</p>', 'Completed', 'Geo technical Investigation, Design and reviewer of Architectural, Structural, Pile load testing and report preparation, Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'English Road, Eskaton, Dhaka.', 'Substation Cum Office Building', '2B+10 Storied', '8386.64 sqm', '56 m', NULL, NULL),
(5, 3, NULL, 'Riyad Al Jannah Jame Mosque', '[\"05275eef-9a9a-446e-95da-85976360af79.webp\",\"4da0337a-0252-4a41-9261-a5f4a8029f1f.webp\"]', '<p>God always helps us. We found god every where, but we closely at Mosque.The material perforated Brick Glass &amp; metal screen facade, wooden door &amp; elongated windows are to be crafted on-ste focusing on almost zero maintenance of the structure. The landscape &amp; water body Beside the main prayer hall is sloped gradually which merges the building mass with its surroundings. As a whole, the built form gives a new image or develops a new language of the mosque, that is much more transformed, simple but unique, bold but at the same time merging with surroundings.</p>', 'Completed', 'Geo technical Investigation, Design and reviewer of Architectural, Structural, Pile load testing and report preparation, Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'Kahalu, Bogura, Bangladesh', 'Religious Building', '2 Storied', '385 sqm', '6 m', NULL, NULL),
(6, 3, NULL, 'Jannat Residence', '[\"jannatresidence1.jpg\"]', 'The project is a duplex residence building located in\r\nBogura. The three dimensional expression is a large,\r\nbold, square mass of facade held in control by concrete\r\nand brick. Duplex Residential floors are set back to\r\ncreate a visual expression and allow them privacy.\r\nTerraces come in different levels in the upper portion to\r\nbe used exclusively and create interesting variations of\r\nform. A green screen introduced in the East serves as a\r\nveil for residential terraces. The three dimensional\r\ncomposition uses a steel canopy to create a termination.', 'Completed', 'Engineering Design Drawing, Procurement\r\nand Construction', 'Confidential', 'Confidential', 'Kahalu, Bogura, Bangladesh', 'Residential Building', '2 Storied', '332 sqm', '10.5 m', NULL, NULL),
(7, 3, 2, 'Sedona 10 Storied Residence Building', '[\"sedona1.jpg\"]', 'This is 10 Storied Residence Building and Total\r\nHeight is 32 m. It\'s North-South Oriented. This Site\r\nis located in Tejgaon residential side. Simplicity\r\nbeing the essence, the project relates itself with the\r\nsurrounding by channeling a feel happy mood\r\nmaking the nature as the ultimate source of\r\ninspirations. For greater comfort use local made\r\nbricks, brick louvers, wooden door, green facade\r\netc. The new vegetation pattern follows the\r\nexisting landscape with minimum intervention.', 'Completed', '-Geo technical Investigation\r\n<br>-Design & reviewer of Architectural, Structural\r\n<br>-Pile load testing and report preparation\r\n<br>-Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'Tejgaon, Dhaka, Bangladesh', '10 Storied Residence Building With\r\n1 Basement', '1B+10 Storied', '2350 sqm', '32 m', NULL, NULL),
(8, 3, 1, 'Signboard (1-A-8)', '[\"signboard1.jpg\"]', 'This substation Located in the historic area within close\r\nproximity of the premier housing area, this project is set\r\nto revitalize the neighborhood. Targeted to become one\r\nof the new chic, residence areas in green model town it\r\nwill combine commerce, environment facilities whilst\r\nconnecting at historic urban texture. This 132kv\r\nsubstation will feature a high-end substation complex\r\nwith two business floors adjoined at upper level. Seen\r\nas the new prototype in new business, the architecture\r\nwill focus on sustainability and cutting-edge technology\r\nwhilst incorporating modern functionality and intelligent\r\ndesign.', 'Completed', '-Geo technical Investigation\r\n<br>-Design & reviewer of Architectural, Structural\r\n<br>-Pile load testing and report preparation\r\n<br>-Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'NARAYANGANJ, DHAKA.', 'HIGH-RISE SUB- STATION & OFFICE BUILDING WITH BASEMENT CAR PARKING', '2B+10 STORIED', 'N/A', 'N/A', NULL, NULL),
(9, 3, 1, 'Adabor (1-C-3)', '[\"adabor1.jpg\"]', 'This substation Located in the historic area within close proximity of the premier housing area, this project is set to revitalize the neighborhood. Targeted to become one of the new chic, residence areas in green model town it will combine commerce, environment facilities whilst connecting at historic urban texture. This 132kv substation will feature a high-end substation complex with two business floors adjoined at upper level. Seen as the new prototype in new business, the architecture will focus on sustainability and cutting-edge technology whilst incorporating modern\r\nfunctionality and intelligent design.', 'Completed', '- Geo technical Investigation\n- Design & reviewer of Architectural, Structural\n- Pile load testing and report preparation\n- Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'Adabor, Dhaka', 'Substation & Office Building', '1B+6 STORIED', 'N/A', '28.2m', NULL, NULL),
(10, 3, 1, 'Orion Group (1-C-23)', '[\"orion1.jpg\"]', 'This substation Located in the historic area within close proximity of the premier housing area, this project is set to revitalize the neighborhood. Targeted to become one of the new chic, residence areas in green model town it will combine commerce, environment facilities whilst connecting at historic urban texture. This 132kv substation will feature a high-end substation complex with two business floors adjoined at upper level. Seen as the new prototype in new business, the architecture will focus on sustainability and cutting-edge technology whilst incorporating modern functionality and intelligent design.', 'Completed', 'Design & Consultancy', 'Confidential', 'Confidential', 'Manda, Dhaka', 'Substation & Office Building', '1B+5 Storied', 'N/A', '28.2 m', NULL, NULL),
(11, 3, 1, 'Substation and Office Building at Manda', '[\"manda1.jpg\"]', '<p>This substation Located in the historic area within close proximity of the premier housing area, this project is set to revitalize the neighborhood. Targeted to become one of the new chic, residence areas in green model town it will combine commerce, environment facilities whilst connecting at historic urban texture. This 132kv substation will feature a high-end substation complex with two business floors adjoined at upper level. Seen as the new prototype in new business, the architecture will focus on sustainability and cutting-edge technology whilst incorporating modern functionality and intelligent design. </p>', 'Completed', '- Geo technical Investigation\n- Design &amp; reviewer of Architectural, Structural\n- Pile load testing and report preparation\n- Pile Integrity test on cast in-situ Pile', 'Confidential', 'Confidential', 'Manda, Dhaka', 'Sub-Station &amp; Office Building', '1B+5 Storied', 'N/A', '28.2 m', NULL, NULL),
(12, 3, 1, '5 Storied Lamapara Sub-Station & Office Building', '[\"lamapara1.jpg\"]', 'This substation Located in the historic area within close proximity of the premier housing area, this project is set to revitalize the neighborhood. Targeted to become one of the new chic, residence areas in green model town it will combine commerce, environment facilities whilst connecting at historic urban texture. This 132kv substation will feature a high-end substation complex with two business floors adjoined at upper level. Seen as the new prototype in new business, the architecture will focus on sustainability and\ncutting-edge technology whilst incorporating\nmodern functionality and intelligent design.', 'Completed', 'Geo technical Investigation\nDesign & reviewer of Architectural, Structural\nPile load testing and report preparation\nPile Integrity test on cast in-situ Pile', '', '', 'Narayanganj, Dhaka', 'Sub-Station & Office Building', '1B+5 Storied', 'N/A', '28.2 m', NULL, NULL),
(17, 8, 5, '126 MW HFO Power Plant', '[\"126mw1.jpg\"]', 'Chittagong power station is a 126 megawatt (MW) gas-fired power plant in Chittagong Division, Bangladesh. It has a proposed 126-megawatt (MW) expansion. This power plant build along with residence area.', 'Completed', 'Steel Structure Works', 'Confidential', 'Confidential', 'Chittagong, Bangladesh', 'It has 109265 sqm land area along with residence area.', 'N/A', 'N/A', 'N/A', NULL, NULL),
(18, 8, 6, '113 MW HFO Power Plant', '[\"113mw1.jpg\"]', 'This is a HFO power plant based on rolls Royce Engine. The 200 MW combine cycle power plant has a total capacity of 30000 KL with storage tanks of 5000KL capacity. ', 'Completed', 'Steel structure work &\r\npre-engineering', 'Confidential', 'Confidential', 'Rangpur, Bangladesh', '200 MW combined cycle power plant.', '', '', '', NULL, NULL),
(19, 8, 6, '113 MW HFO Power Plant with CO Generation System', '[\"bogra1.jpg\"]', 'This is HFO Power plant based on man engine. The 113 MW combined cycle power plant has a total storage capacity of 50000 KL with storage tanks of 7000 KL capacity.\r\nThere are Twelve engines in the power plant. Confidence group is the client of this project.', 'Completed', 'Steel structure work &\r\npre-engineering', 'Confidential', 'Confidential', 'Bogra, Rajshahi, Bangladesh', '113 MW combined cycle power\r\nplant.', 'N/A', '', '', NULL, NULL),
(20, 8, 6, '55MW HFO Power Plant with CO Generation system', '[\"55mw1.jpg\"]', 'This is HFO Power plant based on man engine. Which is located in Chittagong. The 55 MW power plant has a total storage capacity of 6000 KL with storage tanks of 3000 KL capacity. There are Three engines in the power plant. Confidence group is the client of this project.', 'Completed', 'Steel Structure works', 'Confidential', 'Confidential', 'Chittagong, Bangladesh', '55 MW power plant has a total storage capacity of 6000 KL', 'N/A', '', '', NULL, NULL),
(21, 8, NULL, '50 MW Gas Based Power Plant', '[\"50mwctg1.jpg\"]', 'This is a gas power plant based on rolls royce engine. This is 50 MW power plant. There are Six engines in the power plant. KSRM is the client of this project.', 'Completed', 'Steel structure work &\r\npre-engineering', 'Confidential', 'Confidential', 'Chittagong, Bangladesh', '50 MW power plant with Six Rolls Royce engines', 'N/A', '', '', NULL, NULL),
(22, 8, 9, '57.2 MW Man Diesel Based Power Plant', '[\"57mw1.jpg\"]', '<p>This is a Diesel power plant based on Man Engine Which is located in Narayanganj. There are Three engines in the power plant. Confidence Group is the client of this project.</p>', 'Completed', 'Steel structure work, pre-engineering', 'Confidential', 'Confidential', 'Shiddhirganj, Narayanganj', '57.2MW Man Diesel Power Plant', 'N/A', 'N/A', 'N/A', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_categories`
--

CREATE TABLE `project_categories` (
  `project_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_categories`
--

INSERT INTO `project_categories` (`project_id`, `category_id`) VALUES
(1, 1),
(1, 21),
(2, 13),
(2, 21),
(3, 13),
(3, 21),
(4, 7),
(4, 21),
(5, 10),
(6, 13),
(7, 13),
(8, 21),
(9, 21),
(10, 21),
(11, 21),
(12, 21),
(17, 20),
(18, 20),
(19, 20),
(20, 20),
(21, 20),
(22, 20);

-- --------------------------------------------------------

--
-- Table structure for table `pro_sector`
--

CREATE TABLE `pro_sector` (
  `id` int(11) NOT NULL,
  `sec_title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors`
--

CREATE TABLE `sectors` (
  `id` int(11) NOT NULL,
  `sector` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sectors`
--

INSERT INTO `sectors` (`id`, `sector`) VALUES
(1, 'Transportation'),
(2, 'Bridge'),
(3, 'Building'),
(4, 'Environment'),
(5, 'Infrastructure'),
(7, 'Oil & Gas'),
(8, 'Power & Energy'),
(9, 'Roads & Highway');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `cont_title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `icon`, `short_description`, `image`, `cont_title`, `description`) VALUES
(1, 'Geotechnical Investigation', 'lucide:map', 'Geotechnical investigation implies the use of different methods to determine the physical properties of soil and rock below the surface of the earth in a proposed installation site.', 'geotechnical.jpg', '', '<p>Geotechnical investigation is the study of the physical and mechanical properties of the soil and rock on which a construction project is to be built. As an engineering consultancy organization, we offer comprehensive geotechnical investigation services to provide our clients with a detailed understanding of the site conditions and the potential challenges that may impact their construction project.\n</p><p>Our geotechnical investigation services provide our clients with a detailed understanding of the site conditions and potential challenges, which is essential for the successful design and construction of their project. With our expertise and experience in geotechnical investigation, we can help ensure that your construction project is completed safely and efficiently.</p>'),
(2, 'Detail Engineering Consultancy', 'lucide:user-cog', 'We provide all kind of Architectural, Geotechnical, Sub-structure Superstructure Detailed Design and consultancy services. We have a group of expert Geotechnical Engineers.', 'consultancy.jpg', '', '<p>Cozmic Technology provides expert technical support and advice to clients across a range of industries. We offer a comprehensive range of services to help our clients successfully complete their projects, including:\n</p><p><strong>Project management:</strong></p><p> We manage the planning, design, and implementation of engineering projects to ensure they are completed on time, within budget, and to the highest quality standards.\n</p><p><strong>Design and analysis:</strong></p><p>Our team of engineers provides technical design and analysis services to support the development of new products and systems.\n</p><p><strong>Testing and certification:</strong></p><p>We offer testing and certification services to ensure that products and systems meet industry standards and regulations.\n<strong>Technical support:</strong></p><p> We provide technical support to clients during all phases of a project, from development to implementation.\n<strong>Training and development:</strong></p><p> We offer training and development programs to help clients improve their engineering and technical skills.\n<strong>Feasibility studies:</strong></p><p>We conduct feasibility studies to help clients assess the viability of new projects.\n</p><p><strong>Regulatory compliance:</strong></p><p>We assist clients in ensuring compliance with relevant regulations and standards in their industry.\nWith our experienced team of engineers and technical specialists, we are dedicated to providing our clients with high-quality, reliable, and cost-effective engineering consultancy services.</p>'),
(3, 'Project Management', 'lucide:settings', 'We have experienced specialists with a background in engineering who are able to oversee a project from start to finish. By taking advantage of professional know-how, we are able to provide the best possible service for our clients.', 'management.jpg', '', '<p>Project management in civil engineering involves planning, organizing, and managing resources to bring a construction project to completion. It involves coordinating the work of architects, engineers, contractors, and sub-contractors to ensure that the project is completed within budget and on schedule. Key activities include developing project plans, setting project schedules, monitoring progress, and controlling costs. Effective project management in civil engineering requires strong leadership skills, technical expertise, and a deep understanding of the construction process.</p>'),
(4, 'Construction Supervision', 'lucide:hard-hat', 'We are providing construction &amp; supervision services use specialized knowledge regarding intricate processes such as defining design requirements, reviewing designs documents, supervising ongoing work onsite, inspecting functional performance tests etc.', 'construction.jpg', '', '<p>As part of our engineering consultancy services, we offer comprehensive construction supervision for building and infrastructure projects. Our team of experienced construction supervisors is dedicated to ensuring that your project is completed on time, within budget, and to the highest quality standards.\n\n</p><p><br /></p><p><br /></p><p>Our construction supervision services include:\n\n</p><p><br /></p><p><br /></p><p><strong>Overseeing contractors and sub-contractors:</strong></p><p> We ensure that the work is performed according to the project plans and specifications and that quality standards are met.\n\n</p><p><br /></p><p><br /></p><p><strong>Monitoring progress:</strong></p><p> We keep track of the project schedule and budget and report any deviations to the project manager.\n\n</p><p><br /></p><p><br /></p><p><strong>Coordinating with design teams:</strong></p><p> We collaborate with architects, engineers, and other design professionals to resolve any design or construction issues that arise.\n\n</p><p><br /></p><p><br /></p><p><strong>Managing safety:</strong></p><p>  We ensure that safety protocols are followed and that the construction site is a safe working environment for all workers.\n\n</p><p><br /></p><p><br /></p><p><strong>Resolving issues:</strong></p><p> We identify and resolve any issues or disputes that arise during construction.\n\n</p><p><br /></p><p><br /></p><p>Our construction supervisors have extensive experience in the construction industry and a deep understanding of the construction process. They are equipped with the technical knowledge and leadership skills necessary to effectively manage multiple stakeholders and timelines, ensuring that your project is completed successfully. With our construction supervision services, you can have peace of mind knowing that your project is in good hands.</p>'),
(5, 'Structural Integrity', 'lucide:building-2', 'We focuses on structural integrity, making sure that a structure is resilient and won\'t suffer from unexpected issues in the short or long-term. It covers everything from soil analysis to design calculations, ensuring all aspects are suitable for their intended purpose.', 'structure.jpg', '', '<p>Structural integrity refers to the ability of a building or structure to withstand its intended loads and maintain its original shape and stability over time. As an engineering consultancy organization, we provide expert services to assess and ensure the structural integrity of buildings and infrastructure.\n\nOur services for structural integrity include:\nStructural inspections:  We conduct thorough inspections of buildings and structures to assess their condition and identify any potential issues.\nStructural analysis: We use advanced techniques and tools to perform in-depth structural analysis and evaluate the stability and performance of a building or structure.\nLoad testing: We conduct load testing to verify the capacity of a building or structure to withstand its intended loads.\n\nRepair and rehabilitation: We provide recommendations and support for repairing and rehabilitating structures that are in need of improvement.\n\nMaterial testing: We conduct material testing to ensure that the materials used in construction meet quality standards and are suitable for their intended use.\nRisk assessment: We assess the risk associated with a building or structure, including the potential for failure or collapse, and provide recommendations for reducing or eliminating these risks.\n\nOur team of experienced engineers and technical specialists are equipped with the knowledge and tools necessary to assess and ensure the structural integrity of your building or infrastructure. With our services, you can have peace of mind knowing that your building or structure is safe and secure for its intended use.</p>'),
(6, 'Testing and Surveys', 'lucide:ruler', 'Our testing and survey services are conducted using state-of-the-art equipment and technology, ensuring that we provide accurate and reliable results. We are committed to providing our clients with comprehensive reports that outline the findings and provide recommendations for design and construction.', '1740c48e0c.jpg', 'Testing &amp; Survey', '<p>Testing and survey services are critical components of any engineering project. These services are designed to provide valuable data that can be used to ensure that a project is completed to the highest possible standard. Our engineering organization offers a wide range of testing and survey services to clients across various industries.\nOur testing services include geotechnical testing, materials testing, non-destructive testing, and environmental testing. These tests are essential for assessing the physical properties of materials and their suitability for specific uses. The results of these tests are used to inform the design and construction of buildings, bridges, roads, and other structures.\nOur survey services include land and hydrographic surveying. Our team of experienced surveyors uses the latest technology to capture detailed and accurate data about a site\'s topography, including the elevations and contours of the land, the location of natural and man-made features, and the depths of bodies of water. This information is used to create accurate maps, plans, and designs, providing essential information to the engineering and construction teams.\nWe take pride in the quality and accuracy of our testing and survey services, and we are committed to providing our clients with comprehensive reports that detail the findings and recommendations for their projects. Our team works closely with our clients to understand their unique requirements and to ensure that the testing and survey services we provide are tailored to their specific needs.</p>');

-- --------------------------------------------------------

--
-- Table structure for table `social`
--

CREATE TABLE `social` (
  `id` int(2) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social`
--

INSERT INTO `social` (`id`, `name`, `icon`, `link`) VALUES
(1, 'Twitter', 'bi bi-twitter', '#'),
(2, 'Facebook', 'bi bi-facebook', 'https://www.facebook.com/cozmictechnology'),
(3, 'Instagram', 'bi bi-Instagram', '#'),
(4, 'Linkedin', 'bi bi-linkedin', 'https://www.linkedin.com/company/cozmic-technology');

-- --------------------------------------------------------

--
-- Table structure for table `strength`
--

CREATE TABLE `strength` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `strength`
--

INSERT INTO `strength` (`id`, `title`, `icon`, `content`) VALUES
(1, 'Best Management', 'lucide:user-cog', 'We have best professionals they who can find to provide high quality advice and manage projects successful. Our knowledge and experience which leads to better outcomes for their clients.'),
(2, 'Expert Technical Team', 'lucide:users', 'We are a Collective of Geotechnical Engineers Architects, Designers and Planners Working Together to Build a Better Future'),
(3, 'Modern Equipment', 'lucide:wrench', 'We have modern equipment that can be used for geotechnical investigation and analysis in order to understand the physical properties of a site before construction begins. We are committed to analyze data more accurately and provide better solutions for their clients.'),
(4, 'Best Procurement Experts', 'lucide:user-round-search', 'We have procurement experts that can aid in the optimization of your business operations. From helping you source material, to facilitating negotiations and costing assessment with stakeholders, we provide end-to-end solutions for our clients.');

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` int(11) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `designation` varchar(50) DEFAULT NULL,
  `message` varchar(500) DEFAULT NULL,
  `fb_link` varchar(100) DEFAULT NULL,
  `insta_link` varchar(100) DEFAULT NULL,
  `linkedin_link` varchar(100) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `fb` varchar(255) DEFAULT NULL,
  `insta` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `image`, `name`, `designation`, `message`, `fb_link`, `insta_link`, `linkedin_link`, `twitter`, `fb`, `insta`, `linkedin`) VALUES
(1, 'ceo_coz.jpg', 'Mrs. Zannatul Ferdusi', 'Chief Executive Officer', 'I would like to extend a warm welcome to Cozmic Technology. I am proud to lead a team of dedicated professionals who are committed to providing innovative and sustainable solutions that meet the needs of our clients.', NULL, '', '0', NULL, NULL, NULL, NULL),
(3, 'pro_manager.jpg', 'Parvez Jhinuk', 'Assistant Manager', 'We believe that the future of engineering relies in our ability to embrace new technologies, promote sustainable practices, and deliver quality solutions that address the complex challenges of today\'s world.', NULL, '', '0', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `company` varchar(50) DEFAULT NULL,
  `stars` tinyint(4) NOT NULL,
  `image` varchar(255) NOT NULL,
  `story` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `designation`, `company`, `stars`, `image`, `story`) VALUES
(1, '\r\nMr. Zhao', 'Project Engineer', 'TBEA', 5, 'MrZhao.jpg', 'I recently had the pleasure of working with the Cozmic team. From start to finish, they exceeded all of my expectations. Their expertise in the engineering field was evident in every interaction and they brought a level of professionalism.'),
(2, 'Mr. Min', 'Project Enginner', 'TBEA', 5, 'MrMin.jpg', 'Throughout the project, they were always available to answer any questions and provided regular updates to ensure that the project was on track. They listened to my needs and provided thoughtful, creative solutions that exceeded my expectations.');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(2) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(55) NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `image`, `date`, `role`) VALUES
(6, 'Mubinul Hoque', 'mubinulhq@gmail.com', '$2b$10$J0CUpkYtyzZjH4QDkXRhH.7.Jbq.kydnmV1akp3NzVcFaSRu/FEcO', NULL, '2026-06-29 06:21:51', 'SuperAdmin'),
(7, 'Israk', 'it01@iecbd.org', '$2b$15$woSsIz1M0iGCa.CVhdPsL.OKjk8pCi8UjAug2eHb17.DNEJ6krjkC', NULL, '2026-06-29 06:24:07', 'Admin'),
(8, 'SuperAdmin', 'superadmin@cozmic.com', '$2b$10$z9FmKBPuuiq0IYsm6N8fJOJ24EHGUKVJpS.Y7Plm5r3d3quei50CW', NULL, '2026-07-02 00:25:34', 'Admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_us`
--
ALTER TABLE `about_us`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `career`
--
ALTER TABLE `career`
  ADD PRIMARY KEY (`id`),
  ADD KEY `career_status_idx` (`status`),
  ADD KEY `career_deadline_idx` (`deadline`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clients_client_name_idx` (`client_name`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `homepage`
--
ALTER TABLE `homepage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_message_cat_id_idx` (`message_cat_id`),
  ADD KEY `messages_status_idx` (`status`),
  ADD KEY `messages_date_idx` (`date`);

--
-- Indexes for table `message_category`
--
ALTER TABLE `message_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_post_catid_idx` (`post_catid`),
  ADD KEY `posts_date_idx` (`date`);

--
-- Indexes for table `post_category`
--
ALTER TABLE `post_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_sector_id_idx` (`sector_id`),
  ADD KEY `projects_client_id_idx` (`client_id`),
  ADD KEY `projects_status_idx` (`status`);

--
-- Indexes for table `project_categories`
--
ALTER TABLE `project_categories`
  ADD PRIMARY KEY (`project_id`,`category_id`),
  ADD KEY `project_categories_project_id_idx` (`project_id`),
  ADD KEY `project_categories_category_id_idx` (`category_id`);

--
-- Indexes for table `pro_sector`
--
ALTER TABLE `pro_sector`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_name_idx` (`name`);

--
-- Indexes for table `social`
--
ALTER TABLE `social`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `strength`
--
ALTER TABLE `strength`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_us`
--
ALTER TABLE `about_us`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `career`
--
ALTER TABLE `career`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `homepage`
--
ALTER TABLE `homepage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `message_category`
--
ALTER TABLE `message_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `post_category`
--
ALTER TABLE `post_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `pro_sector`
--
ALTER TABLE `pro_sector`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors`
--
ALTER TABLE `sectors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `social`
--
ALTER TABLE `social`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `strength`
--
ALTER TABLE `strength`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_messages_category` FOREIGN KEY (`message_cat_id`) REFERENCES `message_category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_category` FOREIGN KEY (`post_catid`) REFERENCES `post_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `fk_projects_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_projects_sectors` FOREIGN KEY (`sector_id`) REFERENCES `sectors` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `project_categories`
--
ALTER TABLE `project_categories`
  ADD CONSTRAINT `fk_proj_cat_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_proj_cat_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
