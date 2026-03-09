locals {
  prefix = "${var.project_name}-${var.environment}"
  tags = {
    environment = var.environment
    project     = var.project_name
    managed_by  = "terraform"
  }
}

module "resource_group" {
  source   = "./modules/resource_group"
  name     = "${local.prefix}-rg"
  location = var.location
  tags     = local.tags
}

module "networking" {
  source              = "./modules/networking"
  prefix              = local.prefix
  location            = var.location
  resource_group_name = module.resource_group.name
}

module "acr" {
  source              = "./modules/acr"
  prefix              = local.prefix
  location            = var.location
  resource_group_name = module.resource_group.name
}

module "aks" {
  source                     = "./modules/aks"
  prefix                     = local.prefix
  location                   = var.location
  resource_group_name        = module.resource_group.name
  kubernetes_version         = var.kubernetes_version
  node_count                 = var.node_count
  node_vm_size               = var.node_vm_size
  subnet_id                  = module.networking.subnet_id
  acr_id                     = module.acr.acr_id
  log_analytics_workspace_id = module.aks.log_workspace_id
  tags                       = local.tags
}