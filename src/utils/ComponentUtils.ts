import { ObjectUtils } from 'src/utils/ObjectUtils';

const create = <I, RP extends { self?: I }>(render: (params: RP) => I) => {
    type RenderParams = RP;
    return {
        render: (renderParams: RenderParams) => {
            const self = render(renderParams as RP);
            return {
                reRender: (partialParams: Partial<RenderParams> = {}) => {
                    const fullParams = ObjectUtils.map((value, key) => {
                        return partialParams[key] || value;
                    }, renderParams);
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
