import { ClientProvider } from "@/components/providers/client-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { auth } from "@/lib/auth";

type OmitChildren<P> = Omit<P, "children">;

type ProviderProps<T extends React.ComponentType<any>> = T extends React.ComponentType<infer P>
    ? [T, OmitChildren<P>]
    : never;

const combineProviders = (providers: ProviderProps<any>[]) => {
    return ({ children }: { children: React.ReactNode }) => {
        return providers.reduceRight((acc, [Provider, props]) => {
            return <Provider {...props}>{acc}</Provider>;
        }, children as React.ReactNode);
    };
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const CombinedProvider = combineProviders([
        [ClientProvider, {}],
        [AuthProvider, { session: auth() }],
    ]);
    return <CombinedProvider>{children}</CombinedProvider>;
};
