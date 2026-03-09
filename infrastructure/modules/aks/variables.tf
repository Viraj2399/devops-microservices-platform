variable "prefix"                      { type = string }
variable "location"                    { type = string }
variable "resource_group_name"         { type = string }
variable "kubernetes_version"          { type = string }
variable "node_count"                  { type = number }
variable "node_vm_size"                { type = string }
variable "subnet_id"                   { type = string }
variable "acr_id"                      { type = string }
variable "log_analytics_workspace_id"  { type = string }
variable "tags"                        { 
  type = map(string)
  default = {} 
}