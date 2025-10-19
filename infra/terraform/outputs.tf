output "container_image_var_example" {
  value = "ghcr.io/<owner>/shopping-cart:${var.image_tag}"
  description = "Example output for container image URI"
}
