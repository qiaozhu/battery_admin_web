<template>
  <div class="segment goods-detail-info-segment" id="goods-info">
    <div class="segment-header">商品信息</div>
    <div class="segment-area">
      <div class="goods-detail-info-title">
        <span>{{ goodsInfo.goodsName }}</span>
      </div>
      <el-row>
        <el-col>
          <div class="segment-label">供应商</div>
          <div class="segment-content">
            <span v-if="goodsInfo.isSelf === 1">自营</span>
            <span v-else>{{ goodsInfo.companyName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">煤种</div>
          <div class="segment-content">{{ goodsInfo.goodsTypeValue }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">煤矿</div>
          <div class="segment-content">{{ goodsInfo.coalMine.coalMineName }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">库存</div>
          <div class="segment-content">{{ goodsInfo.number | toFixed(2) }} 吨</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">价格更新日期</div>
          <div class="segment-content">{{ goodsInfo.updateTime }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">产地</div>
          <div class="segment-content">{{ goodsInfo.coalMine.cityName }}</div>
        </el-col>
      </el-row>
      <el-row class="h-auto">
        <el-col class="segment-item-warp memowarp">
          <div class="segment-label">产地详细地址</div>
          <div class="segment-content" style="width:500px">
            {{ goodsInfo.coalMine | addressFilter }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">交易方式</div>
          <div class="segment-content">{{ goodsInfo.deliveryTypeValue }}</div>
        </el-col>
      </el-row>
      <el-row class="h-auto">
        <el-col class="segment-item-warp memowarp">
          <div class="segment-label">付款方式</div>
          <div class="segment-content">
            <div v-for="(item, index) in goodsInfo.goodsPlanList" :key="index">
              <span v-if="goodsInfo.goodsPlanList.length > 1">{{ index + 1 }}、</span>
              {{ item.deliveryPayTypeValue }}； 坑口含税价:
              <span class="font-orange">{{ item.price | thousands(2) }}</span
              >(元/吨)
            </div>
            <a href="./static/payprocess.html" target="blank">
              <el-button type="text" size="medium">
                <i class="el-icon-info font-orange mr-5"></i>查看付款说明
              </el-button>
            </a>
          </div>
        </el-col>
      </el-row>
      <el-row class="h-auto">
        <el-col class="segment-item-warp memowarp">
          <span class="segment-label">商品备注</span>
          <span class="segment-content">{{ goodsInfo.remark || '-' }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <span class="segment-label">检测机构</span>
          <span class="segment-content">{{ goodsInfo.testingOrganization || '-' }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span class="segment-label">检测日期</span>
          <span class="segment-content">{{ goodsInfo.testingDate | timesplit }}</span>
        </el-col>
      </el-row>
      <el-row class="h-auto" v-if="goodsInfo.goodsImgList.length > 0">
        <el-col :span="24" class="segment-item-warp imgwarp">
          <span class="segment-label">&nbsp;</span>
          <div class="segment-content">
            <div
              v-for="(url, index) in goodsInfo.goodsImgList"
              :key="index"
              class="preview-grid mt-10"
            >
              <div
                class="preview-grid-img"
                title="点击查看大图"
                :style="{ backgroundImage: 'url(' + url + ')' }"
                @click="showImgDialog(url)"
              ></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 图片dialog -->
    <el-dialog :visible.sync="showImgObj.show" class="preview-img">
      <img width="100%" :src="showImgObj.imgUrl" />
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import utils from '@/utils/utils';

import noproimg from '@/assets/img/pro-img-no.png';

export default {
  props: {
    goodsInfo: {
      type: Object,
      required: true,
      default: function() {
        return {
          coalMine: {},
          goodsPlanList: [],
          goodsImgList: []
        };
      }
    }
  },
  data: function() {
    return {
      normData: {},
      DClabelArr: [],
      showImgObj: {
        show: false,
        imgUrl: ''
      }
    };
  },
  computed: {},
  watch: {
    'goodsInfo.goodsNormList': async function(newValue, oldValue) {
      if (this.DClabelArr && this.DClabelArr.length === 0) {
        let dict = await utils.getSysdict('DC');
        this.DClabelArr = dict;
      }
      this.initNormData(newValue);
    }
  },
  created() {},
  mounted() {},
  methods: {
    initNormData(goodsNormList) {
      let normData = {};
      goodsNormList.forEach(element => {
        // 下拉选项 选中值是个对象 需要遍历原始指标数组取得选中值label
        if (element.normCode == 'DC') {
          normData['goods' + element.normCode + '1'] = this.DClabelArr[element.value1 - 1];
        } else {
          normData['goods' + element.normCode + '1'] = element.value1;
        }
      });
      this.normData = normData;
    },
    showImgDialog(imgUrl) {
      if (!imgUrl) return;
      this.showImgObj.show = true;
      this.showImgObj.imgUrl = imgUrl;
    }
  },
  filters: {
    addressFilter: coalMine => {
      if (!coalMine.coalMineId) return;
      if (coalMine.areaName) {
        return `${coalMine.provinceName} ${coalMine.cityName} ${coalMine.areaName} ${
          coalMine.address
        } `;
      } else {
        return `${coalMine.provinceName} ${coalMine.cityName} ${coalMine.address} `;
      }
    }
  }
};
</script>
<style lang="postcss" scoped>
@import '../assets/css/common/theme.css';
.goods-detail-info-segment {
  margin-bottom: 0;
  flex: 1 1 auto;
  .el-row {
    height: 36px;
    line-height: 36px;
  }
  .goods-detail-info-title {
    font-size: 20px;
    color: #333;
    font-weight: 400;
    margin-left: 28px;
    margin-bottom: 20px;
  }
}
</style>
