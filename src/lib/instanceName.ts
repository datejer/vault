const definedInstanceName = process.env.NEXT_PUBLIC_INSTANCE_NAME;
const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
const prodUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const deploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
const deploymentDomain = env === "production" ? prodUrl : deploymentUrl;
const instanceName = definedInstanceName || deploymentDomain || "Vault";
export { instanceName };
