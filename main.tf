provider "aws" {
  region = "us-west-2"
}

resource "aws_launch_configuration" "bp_webserver_launch" {
  image_id = "ami-084f960b15b503778"
  instance_type = "t2.micro"
  security_groups = ["${aws_security_group.bp_sg.id}"]
  key_name = "beautiful-portland-production"

  user_data = "${file("server_config/configure_webserver.sh")}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "bp_asg" {
  launch_configuration = "${aws_launch_configuration.bp_webserver_launch.id}"
  availability_zones = ["us-west-2a", "us-west-2b"]
  min_size = 1
  max_size = 3
  desired_capacity = 1
  load_balancers = ["${aws_elb.bp_elb.name}"]
  health_check_type = "ELB"
}

resource "aws_security_group" "bp_sg" {
  name = "bp-sg"

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_elb" "bp_elb" {
  name = "bp-elb"
  security_groups = ["${aws_security_group.bp_sg.id}"]
  availability_zones = ["us-west-2a", "us-west-2b"]

  health_check {
    healthy_threshold = 2
    unhealthy_threshold = 2
    timeout = 3
    interval = 30
    target = "HTTP:80/"
  }

  listener {
    lb_port = 80
    lb_protocol = "http"
    instance_port = "80"
    instance_protocol = "http"
  }
  # listener {
  #   lb_port = 443
  #   lb_protocol = "https"
  #   instance_port = "443"
  #   instance_protocol = "https"
  # }

}

resource "aws_s3_bucket" "bp_s3" {
  bucket = "beautiful-portland-carousel-photos-prod"
  acl    = "private"

  lifecycle {
    create_before_destroy = true
  }
}
