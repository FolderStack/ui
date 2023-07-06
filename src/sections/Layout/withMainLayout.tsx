import { MainLayout } from "./MainLayout";

export function withMainLayout(Component: React.FC) {
    return function ComponentWithMainLayout(props: any) {
        return (
            <MainLayout>
                <Component />
            </MainLayout>
        );
    };
}
