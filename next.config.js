const nextConfig = {
  async redirects() {
    return [
      {
        source: "/account",
        destination: "/dashboard/settings",
        permanent: true,
      },
      {
        source: "/account/settings",
        destination: "/dashboard/settings",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
