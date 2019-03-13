module.exports = {
    preset: 'ts-jest',
    // globals: {
    //   'ts-jest': {
    //     tsConfigFile: 'tsconfig.json',
    //   },
    // },
    // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    // transform: {
    //   '^.+\\.tsx?$': 'ts-jest',
    // },
    // testMatch: ['**/src/**/*.test.(ts|js)'],
    // testEnvironment: 'node',
    modulePaths: ['<rootDir>', '<rootDir>/src'],
    // setupFiles: ['./jest.setup.ts'],
    moduleNameMapper: {
        '^src(/.*)?$': '<rootDir>/src/$1',
        //   '^components(/.*)?$': '<rootDir>/src/components/$1',
        //   '^containers(/.*)?$': '<rootDir>/src/containers/$1',
        //   '^reducers(/.*)?$': '<rootDir>/src/reducers/$1',
        //   '^modules/(.*)$': '<rootDir>/src/modules/$1',
        //   '^modules$': '<rootDir>/src/modules/index',
        //   '^actions(/.*)?$': '<rootDir>/src/actions/$1',
        //   '^assets(/.*)?$': '<rootDir>/src/assets/$1',
        //   '^utils(/.*)?$': '<rootDir>/src/utils/$1',
        //   '^api(/.*)?$': '<rootDir>/src/api/$1',
    },
};
