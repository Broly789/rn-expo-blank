module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'], // 项目根目录
          extensions: ['.js', '.jsx', '.json'],
          alias: {
            '@': './src', // @/ 指向项目根
            '@components': './src/components',
            '@assets': './src/assets',
            '@utils': './src/utils',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            // 其他别名根据需要添加
            // '@api': './src/api',
          },
        },
      ],
    ],
  }
}
