
const nextConfig = {
    webpack(config:any) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        
        return config;
        },
 
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
    api: {
        bodyParser: {
          sizeLimit: "100mb", // Set to 100MB
        },
      },

    experimental: {
    serverActions: {
        bodySizeLimit: '30mb',
    },
    },
}

export default nextConfig;
