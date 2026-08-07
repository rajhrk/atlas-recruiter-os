import { RecruiterKnowledgeTopic } from "./types";
import { upsKnowledge } from "./electrical/ups";
import { generatorKnowledge } from "./electrical/generator";
import { atsKnowledge } from "./electrical/ats";
import { switchgearKnowledge } from "./electrical/switchgear";
import { transformerKnowledge } from "./electrical/transformer";
import { buswayKnowledge } from "./electrical/busway";
import { pduKnowledge } from "./electrical/pdu";
import { batterySystemsKnowledge } from "./electrical/batterySystems";
import { cracKnowledge } from "./cooling/crac";
import { crahKnowledge } from "./cooling/crah";
import { chillersKnowledge } from "./cooling/chillers";
import { coolingTowersKnowledge } from "./cooling/coolingTowers";
import { pumpsKnowledge } from "./cooling/pumps";
import { heatExchangersKnowledge } from "./cooling/heatExchangers";
import { epmsKnowledge } from "./operations/epms";
import { bmsKnowledge } from "./operations/bms";
import { dcimKnowledge } from "./operations/dcim";
import { scadaKnowledge } from "./operations/scada";
import { cmmsKnowledge } from "./operations/cmms";
import { monitoringSystemsKnowledge } from "./operations/monitoringSystems";
import { commissioningKnowledge } from "./construction/commissioning";
import { epcKnowledge } from "./construction/epc";
import { mepKnowledge } from "./construction/mep";
import { fatKnowledge } from "./construction/fat";
import { satKnowledge } from "./construction/sat";
import { istKnowledge } from "./construction/ist";
import { qaqcKnowledge } from "./construction/qaqc";
import { turnoverKnowledge } from "./construction/turnover";
import { vesdaKnowledge } from "./fire/vesda";
import { fm200Knowledge } from "./fire/fm200";
import { fireAlarmKnowledge } from "./fire/fireAlarm";
import { fireSuppressionKnowledge } from "./fire/fireSuppression";
import { epoKnowledge } from "./fire/epo";
import { smokeDetectionKnowledge } from "./fire/smokeDetection";
import { fiberOpticsKnowledge } from "./network/fiberOptics";
import { structuredCablingKnowledge } from "./network/structuredCabling";
import { spineLeafKnowledge } from "./network/spineLeaf";
import { bgpKnowledge } from "./network/bgp";
import { dwdmKnowledge } from "./network/dwdm";
import { patchPanelsKnowledge } from "./network/patchPanels";
import { crossConnectKnowledge } from "./network/crossConnect";
import { networkMonitoringKnowledge } from "./network/networkMonitoring";
import { gpuClustersKnowledge } from "./ai/gpuClusters";
import { infinibandKnowledge } from "./ai/infiniband";
import { nvlinkKnowledge } from "./ai/nvlink";
import { liquidCoolingKnowledge } from "./ai/liquidCooling";
import { rackDensityKnowledge } from "./ai/rackDensity";
import { aiPodsKnowledge } from "./ai/aiPods";
import { rdmaKnowledge } from "./ai/rdma";
import { highSpeedNetworkingKnowledge } from "./ai/highSpeedNetworking";
import { physicalSecurityKnowledge } from "./security/physicalSecurity";
import { accessControlKnowledge } from "./security/accessControl";
import { cctvKnowledge } from "./security/cctv";
import { biometricsKnowledge } from "./security/biometrics";
import { socKnowledge } from "./security/soc";
import { nercCipKnowledge } from "./security/nercCip";
import { iso27001Knowledge } from "./security/iso27001";
import { zeroTrustKnowledge } from "./security/zeroTrust";
import { pueKnowledge } from "./sustainability/pue";
import { cueKnowledge } from "./sustainability/cue";
import { renewableEnergyKnowledge } from "./sustainability/renewableEnergy";
import { batteryEnergyStorageKnowledge } from "./sustainability/batteryEnergyStorage";
import { microgridKnowledge } from "./sustainability/microgrid";
import { energyEfficiencyKnowledge } from "./sustainability/energyEfficiency";
import { wasteHeatRecoveryKnowledge } from "./sustainability/wasteHeatRecovery";
import { carbonNeutralityKnowledge } from "./sustainability/carbonNeutrality";
import { virtualizationKnowledge } from "./cloud/virtualization";
import { vmwareKnowledge } from "./cloud/vmware";
import { kubernetesKnowledge } from "./cloud/kubernetes";
import { openshiftKnowledge } from "./cloud/openshift";
import { openstackKnowledge } from "./cloud/openstack";
import { containersKnowledge } from "./cloud/containers";
import { hypervisorKnowledge } from "./cloud/hypervisor";
import { softwareDefinedInfrastructureKnowledge } from "./cloud/softwareDefinedInfrastructure";
import { economizersKnowledge } from "./cooling/economizers";
import { immersionCoolingKnowledge } from "./cooling/immersionCooling";
import { directToChipCoolingKnowledge } from "./cooling/directToChipCooling";
const knowledgeTopics: RecruiterKnowledgeTopic[] = [
  upsKnowledge,
  generatorKnowledge,
  atsKnowledge,
  switchgearKnowledge,
  transformerKnowledge,
  buswayKnowledge,
  pduKnowledge,
  batterySystemsKnowledge,
  cracKnowledge,
crahKnowledge,
chillersKnowledge,
coolingTowersKnowledge,
pumpsKnowledge,
heatExchangersKnowledge,
epmsKnowledge,
bmsKnowledge,
dcimKnowledge,
scadaKnowledge,
cmmsKnowledge,
monitoringSystemsKnowledge,
commissioningKnowledge,
epcKnowledge,
mepKnowledge,
fatKnowledge,
satKnowledge,
istKnowledge,
qaqcKnowledge,
turnoverKnowledge,
vesdaKnowledge,
fm200Knowledge,
fireAlarmKnowledge,
fireSuppressionKnowledge,
epoKnowledge,
smokeDetectionKnowledge,
fiberOpticsKnowledge,
structuredCablingKnowledge,
spineLeafKnowledge,
bgpKnowledge,
dwdmKnowledge,
patchPanelsKnowledge,
crossConnectKnowledge,
networkMonitoringKnowledge,
gpuClustersKnowledge,
infinibandKnowledge,
nvlinkKnowledge,
liquidCoolingKnowledge,
rackDensityKnowledge,
aiPodsKnowledge,
rdmaKnowledge,
highSpeedNetworkingKnowledge,
physicalSecurityKnowledge,
accessControlKnowledge,
cctvKnowledge,
biometricsKnowledge,
socKnowledge,
nercCipKnowledge,
iso27001Knowledge,
zeroTrustKnowledge,
pueKnowledge,
cueKnowledge,
renewableEnergyKnowledge,
batteryEnergyStorageKnowledge,
microgridKnowledge,
energyEfficiencyKnowledge,
wasteHeatRecoveryKnowledge,
carbonNeutralityKnowledge,
virtualizationKnowledge,
vmwareKnowledge,
kubernetesKnowledge,
openshiftKnowledge,
openstackKnowledge,
containersKnowledge,
hypervisorKnowledge,
softwareDefinedInfrastructureKnowledge,
economizersKnowledge,
immersionCoolingKnowledge,
directToChipCoolingKnowledge,
];

export function getKnowledgeTopic(id: string) {
  return knowledgeTopics.find(
    (topic) => topic.id.toLowerCase() === id.toLowerCase()
  );
}

export function getAllKnowledgeTopics() {
  return knowledgeTopics;
}