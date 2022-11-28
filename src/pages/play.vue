<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import misaka from '../assets/misaka.png';

const puzzleBlockW = ref(10);
const puzzleBlockH = ref(10);
const puzzleRef = ref<any[]>([]);
const selectSwapIndex = ref<number[]>([]);

const setRef = (el: any) => {
  puzzleRef.value.push(el);
};

let matrixArr: Array<any> = reactive([]);

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
    el.style.transform = `translate(${arr[i].x}vw, ${arr[i].y}vw)`;
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
  selectSwapIndex.value.push(puzzleIndex);
  if (selectSwapIndex.value && selectSwapIndex.value.length === 2) {
    const [indexA, indexB] = selectSwapIndex.value;
    swap(puzzleRef.value, matrixArr, indexA, indexB);
    selectSwapIndex.value = [];

    const isSuccess = checkSuccess(matrixArr);

    setTimeout(() => {
      if (isSuccess) {
        alert('拼图完成！');
      }
    }, 500);
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

matrixArr = generateMatrix(3, puzzleBlockW.value, puzzleBlockH.value);
console.log('矩阵数组', matrixArr);

onMounted(() => {
  console.log('组件渲染', puzzleRef.value);
  setTimeout(() => {
    shuffle(puzzleRef.value, matrixArr);
  }, 2000);
});
</script>

<template>
  <div class="puzzle-play">
    <h1>游戏页面</h1>
    <h2>点击两个拼图块进行移动</h2>
    <div class="puzzle-panle">
      <div
        :ref="setRef"
        :style="`width: ${puzzleBlockW}vw; height: ${puzzleBlockH}vw; background-image: url(${misaka});
        background-position: -${item.x}vw -${item.y}vw;
        transform: translate(${item.x}vw, ${item.y}vw)`"
        v-for="(item, index) in matrixArr"
        :i="item.index"
        :key="index"
        class="puzzle-item"
        @click="movePuzzle(Number(item.index))"
      ></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.puzzle-play {
  background: #888;

  .puzzle-panle {
    position: relative;
    width: 600px;
    background-color: rgb(105, 104, 142);
  }

  .puzzle-item {
    position: absolute;
    transition: all 0.3s;
    background-color: bisque;
  }
}
</style>
