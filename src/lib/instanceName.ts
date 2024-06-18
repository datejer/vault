const definedInstanceName = process.env.NEXT_PUBLIC_INSTANCE_NAME;
const deploymentDomain = process.env.NEXT_PUBLIC_VERCEL_URL;
const instanceName = definedInstanceName || deploymentDomain || "Vault";
export { instanceName };
