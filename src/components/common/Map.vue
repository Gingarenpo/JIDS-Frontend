<script lang="js" setup>
    import { onMounted, ref } from 'vue';
    import bid from '../../assets/pins/bid.png';
    import detail from '../../assets/pins/detail.png';
    import gone from '../../assets/pins/gone.png';
    import none from '../../assets/pins/none.png';
    import now from '../../assets/pins/now.png';
    import rover from '../../assets/pins/rover.png';
    import thanks from '../../assets/pins/thanks.png';
    import thumb from '../../assets/pins/thumb.png';
    import IntersectionBox from '../IntersectionBox.vue';
    import Map from 'ol/Map';
    import TileLayer from 'ol/layer/Tile';
    import { View, Feature } from 'ol';
    import { OSM } from 'ol/source';
    import 'ol/ol.css';
    import { transform } from 'ol/proj';
    import { Point } from 'ol/geom';
    import { Style, Icon } from 'ol/style';
    import { Vector as VectorSource } from 'ol/source';
    import { Vector as VectorLayer } from 'ol/layer';

    // 交差点一覧を受け取る
    const props = defineProps(["intersections", "pref", "areas"]);

    // 完了フラグ
    const done = ref(false);

    // 交差点・エリアの情報
    const intersection = ref(null);


    onMounted(() => {
        // マーカーを入れるところ（レイヤー順）
        const markers = {
            gone: [],
            normal: [],
            bid: [],
            thanks: [],
            thumb: [],
            rover: [],
            detail: [],
            now: [],
        };
        
        // マーカーを準備する
        for (const intersection of props.intersections) {
            // 緯度経度が存在しない交差点は除外
            if (intersection.location.x == null || intersection.location.y == null) {
                continue;
            }
            const pin = new Feature({
                geometry: new Point(transform([intersection.location.x, intersection.location.y], 'EPSG:4326', 'EPSG:3857')),
            });
            pin.set("data", intersection);
            pin.set("area", intersection.area);
            // マーカーを追加
            if (intersection.details.length > 0) {
                markers.detail.push(pin);
            }
            else if (intersection.thumbnails.length > 0 && intersection.thumbnails[0].queue.userId !== "Gingarenpo") {
                markers.thanks.push(pin);
            }
            else if (intersection.thumbnails.length > 0) {
                markers.thumb.push(pin);
            }
            else if (intersection.rover === 2) {
                // 四角制限
                markers.rover.push(pin);
            }
            else if (intersection.status === "GONE") {
                markers.gone.push(pin);
            }
            else if (intersection.status === "MOVE") {
                continue;
            }
            else {
                // 何にも当てはまらない場合は通常のマーカー
                markers.normal.push(pin);
            }
        }


        // マーカースタイルを作成する
        const styles = {
            normal: new Style({
                image: new Icon({
                    src: none,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: 1,
                }),
            }),
            bid: new Style({
                image: new Icon({
                    src: bid,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: 1,
                }),
            }),
            detail: new Style({
                image: new Icon({
                    src: detail,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: 1,
                }),
            }),
            gone: new Style({
                image: new Icon({
                    src: gone,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: 1,
                }),
            }),
            rover: new Style({
                image: new Icon({
                    src: rover,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: 1,
                }),
            }),
            thanks: new Style({
                image: new Icon({
                    src: thanks,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: 1,
                }),
            }),
            thumb: new Style({
                image: new Icon({
                    src: thumb,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: 1,
                }),
            }),
        };

        // ソースを作る
        const sources = {
            normal: new VectorSource({
                features: markers.normal,
            }),
            bid: new VectorSource({
                features: markers.bid,
            }),
            detail: new VectorSource({
                features: markers.detail,
            }),
            gone: new VectorSource({
                features: markers.gone,
            }),
            rover: new VectorSource({
                features: markers.rover,
            }),
            thanks: new VectorSource({
                features: markers.thanks,
            }),
            thumb: new VectorSource({
                features: markers.thumb,
            })
        };

        // レイヤーを作成
        const layers = [
            new TileLayer({
                    source: new OSM(),
                }),
            new VectorLayer({
                source: sources.gone,
                style: styles.gone,
            }),
            new VectorLayer({
                source: sources.normal,
                style: styles.normal,
            }),
            new VectorLayer({
                source: sources.rover,
                style: styles.rover,
            }),
            new VectorLayer({
                source: sources.bid,
                style: styles.bid,
            }),
            new VectorLayer({
                source: sources.thanks,
                style: styles.thanks,
            }),
            new VectorLayer({
                source: sources.thumb,
                style: styles.thumb,
            }),
            new VectorLayer({
                source: sources.detail,
                style: styles.detail,
            }),

        ];

        // OpenLayers初期化
        const map = new Map({
            target: 'map',
            layers: layers,
            view: new View({
                center: transform([props.pref.centroid.y, props.pref.centroid.x], 'EPSG:4326', 'EPSG:3857'),
                zoom: 10,
            }),
        });

        // マップのクリックイベントを追加
        map.on("pointermove", (e) => {
            map.forEachFeatureAtPixel(e.pixel, (f) => {
                // 変数更新
                intersection.value = f.get("data");
            });
        });

        // 完了！
        done.value = true;

    });
</script>

<template>
    <div id="map"></div>
    <IntersectionBox :area="area" :intersection="intersection" v-if="intersection" />
</template>

<style scoped>
    #map {
        width: 100%;
        height: 70vh;
        position: relative;
    }
</style>