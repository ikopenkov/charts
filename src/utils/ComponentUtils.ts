import { ObjectUtils } from 'src/utils/ObjectUtils';

const create = <I, RP extends { self?: I }>(
    render: (params: RP) => I,
    remove?: (self: I) => void,
) => {
    type RenderParams = RP;
    return {
        render: (renderParams: RenderParams) => {
            const self = render(renderParams as RP);
            return {
                reRender: (partialParams: Partial<RenderParams> = {}) => {
                    const fullParams = ObjectUtils.map((value, key) => {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                partialParams,
                                key,
                            )
                        ) {
                            return partialParams[key];
                        }
                        return value;
                    }, renderParams);
                    fullParams.self = self;

                    // eslint-disable-next-line no-param-reassign
                    renderParams = fullParams;

                    render(fullParams);
                },

                remove: () => remove(self),
            };
        },
    };
};

export const ComponentUtils = {
    create,
};
