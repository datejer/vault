const definedInstanceName = process.env.NEXT_PUBLIC_INSTANCE_NAME;
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
const nodeEnv = process.env.NODE_ENV;
const prodUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const deploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
const deploymentDomain = vercelEnv === "production" ? prodUrl : deploymentUrl;
const instanceName = `${definedInstanceName || deploymentDomain || "Vault"} ${
  nodeEnv === "development" || vercelEnv === "development" ? "[Dev]" : ""
}`;
const instanceUrl = deploymentDomain || "localhost";
export { instanceName, instanceUrl };
