import { ObjectUtils } from 'src/utils/ObjectUtils';
import { Omit } from 'src/utils/Types';

const create = <I, RP extends { self?: I }>(render: (params: RP) => I) => {
    type RenderParams = Omit<RP, 'self'>;
    return {
        render: (renderParams: RenderParams) => {
            const self = render(renderParams as RP);
            return {
                reRender: (partialParams: Partial<RenderParams> = {}) => {
                    const fullParams: RP = ObjectUtils.map((value, key) => {
                        // @ts-ignore
                        return partialParams[key] || value;
                        // TODO: fix ObjectUtils.map to work with non indexed objects
                    }, renderParams) as any;
                    fullParams.self = self;

                    render(fullParams);
                },
            };
        },
    };
};

export const ComponentUtils = {
    create,
};
