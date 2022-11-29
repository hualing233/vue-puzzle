<script setup lang="ts">
import { ref, reactive } from 'vue';
import misaka from '../assets/misaka.png';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';

const puzzleCount = ref(3);
const puzzleBlockW = ref(30);
const puzzleBlockH = ref(30);
const puzzleRef = ref<any[]>([]);
const selectSwapIndex = ref<number[]>([]);
const imgList = ref<any[]>([misaka, img1, img2]);
const currentImg = ref(misaka);

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

const selectImg = (img: string) => {
  currentImg.value = img;
  scaleImage(img)
  initPuzzle();
}

const scaleImage = (imgSrc: string) => {
  let img = new Image();
  img.src = imgSrc;
  img.onload = function() {
    console.log('加载图片宽高', img.width, img.height);
  }
}

const initPuzzle = () => {
  matrixArr = generateMatrix(puzzleCount.value, puzzleBlockW.value, puzzleBlockH.value);
  setTimeout(() => {
    shuffle(puzzleRef.value, matrixArr);
  }, 2000);
}

initPuzzle();

// onMounted(() => {
//   initPuzzle();
// });
</script>

<template>
  <div class="puzzle-play">
    <div class="select-img">
      <h1>请选择图片开始拼图</h1>
      <div class="img-list">
        <div @click="selectImg(item)" class="img-item" :style="`background-image: url(${item})`" v-for="(item, index) in imgList" :key="index" ></div>
      </div>
    </div>
    <h1>开始拼图</h1>
    <h2>点击两个拼图块进行移动</h2>
    <div class="puzzle-panle">
      <div
        :ref="setRef"
        :style="`width: ${puzzleBlockW}vw; height: ${puzzleBlockH}vw; background-image: url(${currentImg});
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
    background-color: rgb(105, 104, 142);
  }

  .puzzle-item {
    position: absolute;
    transition: all 0.3s;
    background-color: bisque;
  }
}
</style>
