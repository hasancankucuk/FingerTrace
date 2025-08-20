import { MathFingerprintResult, PrecisionFunctions } from "../../models";

export const MathFingerprint = (): MathFingerprintResult => {
    const safeCall = (fn: Function | undefined, fallback: Function): Function => typeof fn === 'function' ? fn : fallback;

    const fallback = () => 0;

    const acos = safeCall(Math.acos, fallback);
    const acosh = safeCall(Math.acosh || ((x: number) => Math.log(x + Math.sqrt(x * x - 1))), fallback);
    const asin = safeCall(Math.asin, fallback);
    const asinh = safeCall(Math.asinh || ((x: number) => Math.log(x + Math.sqrt(x * x + 1))), fallback);
    const atanh = safeCall(Math.atanh || ((x: number) => Math.log((1 + x) / (1 - x)) / 2), fallback);
    const atan = safeCall(Math.atan, fallback);
    const sin = safeCall(Math.sin, fallback);
    const sinh = safeCall(Math.sinh || ((x: number) => (Math.exp(x) - Math.exp(-x)) / 2), fallback);
    const cos = safeCall(Math.cos, fallback);
    const cosh = safeCall(Math.cosh || ((x: number) => (Math.exp(x) + Math.exp(-x)) / 2), fallback);
    const tan = safeCall(Math.tan, fallback);
    const tanh = safeCall(Math.tanh || ((x: number) => (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1)), fallback);
    const exp = safeCall(Math.exp, fallback);
    const expm1 = safeCall(Math.expm1 || ((x: number) => Math.exp(x) - 1), fallback);
    const log1p = safeCall(Math.log1p || ((x: number) => Math.log(1 + x)), fallback);
    const PI = Math.PI;

    const computePrecisionFunctions = (value: number): PrecisionFunctions => ({
        acoshPf: Math.log(value + Math.sqrt(value * value - 1)),
        asinhPf: Math.log(value + Math.sqrt(value * value + 1)),
        atanhPf: Math.log((1 + value) / (1 - value)) / 2,
        sinhPf: (Math.exp(value) - Math.exp(-value)) / 2,
        coshPf: (Math.exp(value) + Math.exp(-value)) / 2,
        tanhPf: (Math.exp(2 * value) - 1) / (Math.exp(2 * value) + 1),
        expm1Pf: Math.exp(value) - 1,
        log1pPf: Math.log(1 + value),
        powPI: Math.pow(PI, value),
    });

    const precisionFunctions = computePrecisionFunctions(1);

    return {
        acos: acos(0.12312423423423424),
        acosh: acosh(1e308),
        asin: asin(0.12312423423423424),
        asinh: asinh(1),
        atanh: atanh(0.5),
        atan: atan(0.5),
        sin: sin(-1e300),
        sinh: sinh(1),
        cos: cos(10.000000000123),
        cosh: cosh(1),
        tan: tan(-1e300),
        tanh: tanh(1),
        exp: exp(1),
        expm1: expm1(1),
        log1p: log1p(10),
        ...precisionFunctions
    };
};