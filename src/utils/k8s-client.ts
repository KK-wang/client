import { KubeConfig, CoreV1Api, Metrics } from "@kubernetes/client-node";
import path from "path";

const kubeConfig = new KubeConfig();
kubeConfig.loadFromFile(path.resolve(__dirname, "../config/k8s/config"));
// 从配置文件中加载 kubeConfig。
const k8sAPI = kubeConfig.makeApiClient(CoreV1Api);
// k8sAPI 即是操作 k8s 集群的 API 对象，文档地址如下：
// https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/
// https://kubernetes-client.github.io/javascript/classes/corev1api.corev1api-1.html

export const metricsClient = new Metrics(kubeConfig);

export default k8sAPI;