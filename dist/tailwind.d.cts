import { R as Ramp } from './primitives-sn-nZCP4.cjs';

declare const oroPreset: {
    readonly theme: {
        readonly extend: {
            readonly colors: {
                readonly oro: {
                    readonly cream: "#FFF2D7";
                    readonly plum: "#3A2646";
                    readonly gold: "#D4A853";
                    readonly ink: "#0B0B0B";
                    readonly paper: "#FFF9ED";
                    readonly white: "#FFFDF8";
                    readonly rose: "#A84E5C";
                };
                readonly 'oro-plum': Ramp;
                readonly 'oro-gold': Ramp;
                readonly 'oro-rose': Ramp;
                readonly 'oro-neutral': Ramp;
                readonly 'oro-accent-text': string;
                readonly 'oro-surface': string;
                readonly 'oro-background': "#FFF9ED";
                readonly 'oro-primary-action': string;
                readonly 'oro-border': string;
            };
            readonly fontFamily: {
                readonly display: readonly ["Fraunces", "Georgia", "serif"];
                readonly body: readonly ["Inter", "system-ui", "sans-serif"];
            };
            readonly spacing: {
                readonly 'oro-xs': "4px";
                readonly 'oro-sm': "8px";
                readonly 'oro-md': "16px";
                readonly 'oro-lg': "24px";
                readonly 'oro-xl': "32px";
                readonly 'oro-xxl': "48px";
            };
            readonly borderRadius: {
                readonly 'oro-none': "0px";
                readonly 'oro-sm': "8px";
                readonly 'oro-md': "12px";
                readonly 'oro-lg': "16px";
                readonly 'oro-xl': "20px";
                readonly 'oro-pill': "999px";
            };
        };
    };
};

export { oroPreset as default, oroPreset };
