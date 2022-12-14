<script setup lang="ts">
import { ref, reactive, nextTick, onBeforeUpdate } from 'vue';
import misaka from '../assets/misaka2.png';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import 'element-plus/es/components/message-box/style/css';
import { ElMessageBox, ElButton } from 'element-plus';
import 'element-plus/es/components/button/style/css';
import { formatSecond } from '../utils';

const easyConfig = {
  count: 3, // 拼图单边块数
  blockW: 30, // 块宽度
  blockH: 30, // 块高度
};
const hardConfig = {
  count: 5,
  blockW: 18,
  blockH: 18,
};
let puzzleConfig = reactive({
  count: 3, // 拼图单边块数
  blockW: 30, // 块宽度
  blockH: 30, // 块高度
});

let puzzleRef: any[] = [];
// 选择移动的图块index
const selectSwapIndex = ref<number[]>([]);
// 图片列表
const imgList = ref<any[]>([misaka, img1, img2]);
// 当前拼图图片
const currentImg = ref(misaka);
// 游戏开始时间
let startTime = 0;

const setRef = (el: any) => {
  puzzleRef.push(el);
};

let matrixArr = reactive({
  list: [] as any[],
});
let checkList = reactive({
  list: [] as any[],
});

// 数组乱序
const upsetArr = (arr: Array<any>) => {
  arr.sort(() => {
    return Math.random() > 0.5 ? -1 : 1;
  });
};

// 洗牌算法
const shuffle = (els: Array<HTMLElement>, arr: Array<any>) => {
  upsetArr(arr);
  for (let i = 0; i < arr.length; i++) {
    const el = els[i];
    if (el) {
      el.style.transform = `translate(${arr[i].x}vw, ${arr[i].y}vw)`;
    }
  }
};

// 置换算法
const swap = (
  els: Array<HTMLElement>,
  arr: Array<any>,
  indexA: number,
  indexB: number,
) => {
  let cache = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = cache;
  const swapArr = [indexA, indexB];
  // debugger;
  for (let i = 0; i < swapArr.length; i++) {
    const swapIndex = swapArr[i];
    const el = els[swapIndex];
    el.style.transform = `translate(${arr[swapIndex].x}vw, ${arr[swapIndex].y}vw)`;
  }
};

// 移动拼图
const movePuzzle = (puzzleIndex: number) => {
  console.log('移动拼图', puzzleIndex);
  if (
    selectSwapIndex.value.length === 1 &&
    selectSwapIndex.value[0] === puzzleIndex
  ) {
    return;
  }
  gameStart();
  selectSwapIndex.value.push(puzzleIndex);
  if (selectSwapIndex.value && selectSwapIndex.value.length === 2) {
    const [indexA, indexB] = selectSwapIndex.value;
    swap(puzzleRef, checkList.list, indexA, indexB);
    selectSwapIndex.value = [];

    const isSuccess = checkSuccess(checkList.list);

    if (isSuccess) {
      const doneTime = getGameDoneTime();
      setTimeout(() => {
        ElMessageBox.alert(`耗时：${doneTime}`, '拼图完成!', {
          appendTo: '#app',
          confirmButtonText: 'ok',
        });
      }, 500);
    }
  }
};

// 检查是否拼图成功
const checkSuccess = (arr: Array<any>) => {
  let isSuccess = true;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].index !== i) {
      isSuccess = false;
      continue;
    }
  }
  return isSuccess;
};

type IMode = 'easy' | 'hard';
const switchMode = (mode: IMode) => {
  const map = {
    easy: easyConfig,
    hard: hardConfig,
  };
  console.log('选择配置', mode, map[mode]);
  Object.assign(puzzleConfig, map[mode]);
  matrixArr.list = [];
  checkList.list = [];
  nextTick(() => {
    puzzleStart();
  });
};

// 生成n维矩阵坐标
const generateMatrix = (n: number, dx: number, dy: number) => {
  let arr = [],
    index = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      arr.push({ x: j * dx, y: i * dy, index });
      index++;
    }
  }
  return arr;
};

const selectImg = async (img: string) => {
  const newImg = await scaleImage(img);
  if (newImg) {
    currentImg.value = newImg as string;
    puzzleStart();
  }
};

const scaleImage = (imgSrc: string) => {
  let img = new Image();
  img.src = imgSrc;
  return new Promise((resvole) => {
    img.onload = function () {
      console.log('加载图片宽高', img.width, img.height);
      const canvas = document.createElement('canvas');
      const rate = window.screen.width / 100;
      console.log('rate', rate);
      canvas.height = canvas.width =
        puzzleConfig.blockW * puzzleConfig.count * rate;
      canvas
        .getContext('2d')
        ?.drawImage(
          img,
          0,
          0,
          canvas.width,
          (img.height * canvas.width) / img.width,
        );
      const imgBase64 = canvas.toDataURL('image/jpeg');
      resvole(imgBase64);
    };
  });
};

// 游戏开始时间
const gameStart = () => {
  if (startTime === 0) {
    startTime = +new Date();
    console.log('开始时间', startTime);
  }
};

// 游戏结束时间
const getGameDoneTime = () => {
  const endTime = +new Date();
  console.log('结束时间', endTime);
  let doneTime = (endTime - startTime) / 1000;
  let doneTimeStr = formatSecond(doneTime);
  startTime = 0;
  return doneTimeStr;
};

// 拼图初始化
const initPuzzle = async () => {
  const newImg = await scaleImage(misaka);
  if (newImg) {
    currentImg.value = newImg as string;
  }
  puzzleStart();
};

// 拼图开始
const puzzleStart = () => {
  checkList.list = generateMatrix(
    puzzleConfig.count,
    puzzleConfig.blockW,
    puzzleConfig.blockH,
  );
  matrixArr.list = generateMatrix(
    puzzleConfig.count,
    puzzleConfig.blockW,
    puzzleConfig.blockH,
  );
  console.log('拼图数组', matrixArr.list, puzzleRef);
  setTimeout(() => {
    shuffle(puzzleRef, checkList.list);
  }, 1200);
};

initPuzzle();

onBeforeUpdate(() => {
  puzzleRef = [];
});
</script>

<template>
  <div class="puzzle-play">
    <div class="select-img">
      <h2>请选择图片开始拼图</h2>
      <div class="img-list">
        <div
          @click="selectImg(item)"
          class="img-item"
          :style="`background-image: url(${item})`"
          v-for="(item, index) in imgList"
          :key="index"
        ></div>
      </div>
    </div>
    <h1>开始拼图</h1>
    <h2>点击两个拼图块进行移动</h2>
    <ElButton color="#67c23a" @click="switchMode('easy')">简单难度</ElButton>
    <ElButton color="#f1902e" @click="switchMode('hard')">困难难度</ElButton>
    <div
      class="puzzle-panle"
      :style="`height: ${puzzleConfig.blockH * puzzleConfig.count}vw;`"
    >
      <div
        :ref="setRef"
        :style="`width: ${puzzleConfig.blockW}vw; height: ${puzzleConfig.blockH}vw; background-image: url(${currentImg});
        background-position: -${item.x}vw -${item.y}vw;
        transform: translate(${item.x}vw, ${item.y}vw)`"
        v-for="(item, index) in matrixArr.list"
        :i="item.index"
        :key="index"
        class="puzzle-item"
        @click="movePuzzle(Number(item.index))"
      ></div>
    </div>
    <ElButton color="#409eff" class="sort-btn" @click="puzzleStart"
      >重新排序</ElButton
    >
  </div>
</template>

<style lang="less" scoped>
.puzzle-play {
  overflow: hidden;
  .select-img {
    .img-list {
      display: flex;
      .img-item {
        width: 30vw;
        height: 30vw;
        background-size: cover;
      }
    }
  }
  .puzzle-panle {
    position: relative;
    margin-top: 20px;
    background-color: rgb(105, 104, 142);
  }
  .sort-btn {
    margin-top: 20px;
  }

  .puzzle-item {
    position: absolute;
    transition: all 0.3s;
    background-color: bisque;
    &:active {
      border: 6px solid rgb(234, 105, 41);
      filter: drop-shadow(2px 4px 6px black);
    }
  }
}
</style>
