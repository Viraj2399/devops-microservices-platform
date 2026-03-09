output "cluster_name"       { value = azurerm_kubernetes_cluster.this.name }
output "kube_config" {
  value     = azurerm_kubernetes_cluster.this.kube_config_raw
  sensitive = true
}
output "host" {
  value     = azurerm_kubernetes_cluster.this.kube_config[0].host
  sensitive = true
}
output "log_workspace_id"   { value = azurerm_log_analytics_workspace.this.id }