// Logros que aparecen en la montaña. `step` indica en qué escalón de la espiral
// se coloca el letrero (0 = base, valores altos = cerca de la cima).
export const SIGNS = [
  {
    id: 'softserve',
    label: ['MIDDLE DEVOPS', '- SOFTSERVE'],
    color: '#3f8f3a',
    step: 3,
    icon: '🌱',
    title: 'Middle DevOps · SoftServe',
    text: 'El primer gran escalón: pipelines CI/CD, contenedores y automatización diaria. Aquí se forjaron las bases.',
  },
  {
    id: 'awspro',
    label: ['AWS DEVOPS', 'PRO'],
    color: '#c9a227',
    step: 8,
    icon: '☁️',
    title: 'AWS Certified DevOps Engineer – Professional',
    text: 'Una de las certificaciones más exigentes de AWS: despliegue continuo, monitoreo, alta disponibilidad y automatización a escala.',
  },
  {
    id: 'senior',
    label: ['SR. DEVOPS', 'ENGINEER'],
    color: '#d1453b',
    step: 14,
    icon: '🚀',
    title: 'Senior DevOps Engineer',
    text: 'Liderazgo técnico, arquitectura de plataformas y mentoría. Del “cómo lo hago” al “cómo lo hacemos mejor como equipo”.',
  },
  {
    id: 'secops',
    label: ['SECURITY', '& GITOPS'],
    color: '#8e44c9',
    step: 19,
    icon: '🛡️',
    title: 'Security & GitOps',
    text: 'Infraestructura declarativa, todo versionado en Git y la seguridad integrada desde el primer commit (shift-left).',
  },
  {
    id: 'nvidia',
    label: ['NVIDIA AI', 'INFRASTRUCTURE'],
    color: '#4a9a2a',
    step: 23,
    icon: '🧠',
    title: 'NVIDIA AI Infrastructure',
    text: 'La cima actual: clústeres de GPU, cargas de trabajo de IA y la infraestructura que entrena los modelos del futuro.',
  },
]

export const LOGOS = {
  aws: {
    title: 'Amazon Web Services',
    icon: '☁️',
    text: 'La nube donde vive gran parte de su trabajo: EC2, EKS, IAM, CloudFormation y mucho más.',
  },
  terraform: {
    title: 'Terraform',
    icon: '🧱',
    text: 'Infraestructura como código. Cada servidor, red y permiso descrito en archivos reproducibles.',
  },
  kubernetes: {
    title: 'Kubernetes',
    icon: '☸️',
    text: 'El timón de los contenedores: orquestación, autoescalado y despliegues sin caídas.',
  },
  gpu: {
    title: 'GPU / Cómputo acelerado',
    icon: '⚡',
    text: 'Tarjetas gráficas trabajando en paralelo para entrenar y servir modelos de IA.',
  },
  containers: {
    title: 'Contenedores',
    icon: '📦',
    text: 'Empaquetar una vez, ejecutar en cualquier lugar. La base de toda plataforma moderna.',
  },
}
