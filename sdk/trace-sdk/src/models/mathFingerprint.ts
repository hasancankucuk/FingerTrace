export type PrecisionFunctions = {
    acoshPf: number;
    asinhPf: number;
    atanhPf: number;
    sinhPf: number;
    coshPf: number;
    tanhPf: number;
    expm1Pf: number;
    log1pPf: number;
    powPI: number;
};

export type MathFingerprintResult = {
    acos: number;
    acosh: number;
    asin: number;
    asinh: number;
    atanh: number;
    atan: number;
    sin: number;
    sinh: number;
    cos: number;
    cosh: number;
    tan: number;
    tanh: number;
    exp: number;
    expm1: number;
    log1p: number;
} & PrecisionFunctions;