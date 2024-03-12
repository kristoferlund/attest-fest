type EasConfig = {
  id: number;
  address: string;
  registryAddress: string;
  explorerUrl: string;
};

export const easConfig: EasConfig[] = [
  {
    id: 1, // Ethereum
    address: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    registryAddress: "0xA7b39296258348C78294F95B872b282326A97BDF",
    explorerUrl: "https://easscan.org",
  },
  {
    id: 10, // Optimism
    address: "0x4200000000000000000000000000000000000021",
    registryAddress: "0x4200000000000000000000000000000000000020",
    explorerUrl: "https://optimism.easscan.org",
  },
  {
    id: 8453, // Base Mainnet
    address: "0x4200000000000000000000000000000000000021",
    registryAddress: "0x4200000000000000000000000000000000000020",
    explorerUrl: "https://base.easscan.org",
  },
  {
    id: 42161, // Arbitrum One
    address: "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458",
    registryAddress: "0xA310da9c5B885E7fb3fbA9D66E9Ba6Df512b78eB",
    explorerUrl: "https://arbitrum.easscan.org/graphql",
  },
  {
    id: 137, // Polygon
    address: "0x5E634ef5355f45A855d02D66eCD687b1502AF790",
    registryAddress: "0x7876EEF51A891E737AF8ba5A5E0f0Fd29073D5a7",
    explorerUrl: "https://polygon.easscan.org",
  },
  // {
  //   id: 534352, // Scroll
  //   address: "0xC47300428b6AD2c7D03BB76D05A176058b47E6B0",
  //   registryAddress: "0xD2CDF46556543316e7D34e8eDc4624e2bB95e3B6",
  //   explorerUrl: "https://scroll.easscan.org",
  // },
  // {
  //   id: 59144, // Linea
  //   address: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
  //   registryAddress: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
  //   explorerUrl: "https://linea.easscan.org",
  // },
  {
    id: 11155111, // Ethereum Sepolia
    address: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    registryAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    explorerUrl: "https://sepolia.easscan.org",
  },
  // {
  //   id: 11155420, // Optimism Sepolia
  //   address: "0x4200000000000000000000000000000000000021",
  //   registryAddress: "0x4200000000000000000000000000000000000020",
  //   explorerUrl: "https://optimism-sepolia.easscan.org",
  // },
  // {
  //   id: 80001, // Polygon Mumbai
  //   address: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
  //   registryAddress: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
  //   explorerUrl: "https://polygon-mumbai.easscan.org",
  // },
  // {
  //   id: 534352, // Scroll Sepolia
  //   address: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
  //   registryAddress: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
  //   explorerUrl: "https://scroll-sepolia.easscan.org",
  // },
  // {
  //   id: 84532, // Base Sepolia
  //   address: "0x4200000000000000000000000000000000000021",
  //   registryAddress: "0x4200000000000000000000000000000000000020",
  //   explorerUrl: "https://base-sepolia.easscan.org",
  // },
];
