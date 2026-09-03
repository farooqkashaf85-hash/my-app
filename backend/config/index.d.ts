declare const config: {
  readonly port: number;
  readonly mongoUri: string;
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly corsOrigins: string[];
};

export = config;