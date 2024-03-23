console.info("start load")
window.viewService = {
    map: null,
    zoom: 13,
    amaplocation: [116.397428, 39.90923],
    //���������¶�ͼ��
    SetAmapContainerSize: function (width, height) {
        console.info("setting container size")

        var div = document.getElementById("container");
        div.style.height = height + "px";

    },
    SetLocation: function (longitude, latitude) {
        console.info("setting loc", longitude, latitude)
        window.viewService.amaplocation = [longitude, latitude];
        if (window.viewService.map) {
            window.viewService.map.setZoomAndCenter(window.viewService.zoom, window.viewService.amaplocation);

            console.info("set loc", window.viewService.zoom, window.viewService.map)
        }
    },
    isHotspot: true

}
AMapLoader.load({ //�״ε��� load
    key: '0896cedc056413f83ca0aee5b029c65d',//�״�load keyΪ����
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.InfoWindow', 'AMap.PlaceSearch']
}).then((AMap) => {
    console.info("loading..")
    var opt = {
        resizeEnable: true,
        center: window.viewService.amaplocation,
        zoom: window.viewService.zoom,
        isHotspot: true
    }
    var map = new AMap.Map('container', opt);
    console.info(AMap, map, opt)

    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar())
    window.viewService.marker = new AMap.Marker({
        position: map.getCenter()
    })
    map.add(window.viewService.marker);
    var placeSearch = new AMap.PlaceSearch();  //����ص��ѯ��
    var infoWindow = new AMap.InfoWindow({});
    map.on('hotspotover', function (result) {
        placeSearch.getDetails(result.id, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                onPlaceSearch(result);
            }
        });
    });

    map.on('moveend', onMapMoveend);
    // map.on('zoomend', onMapMoveend);
    //�ص�����

    window.viewService.map = map;

    function onMapMoveend() {
        var zoom = window.viewService.map.getZoom(); //��ȡ��ǰ��ͼ����
        var center = window.viewService.map.getCenter(); //��ȡ��ǰ��ͼ����λ��
        if (window.viewService.marker) {
            window.viewService.marker.setPosition(center);

        }
        window.objRef.invokeMethodAsync('OnMapMoveend', center);


    }
    function onPlaceSearch(data) { //infoWindow.open(map, result.lnglat);
        var poiArr = data.poiList.pois;
        if (poiArr[0]) {
            var location = poiArr[0].location;
            infoWindow.setContent(createContent(poiArr[0]));
            infoWindow.open(window.viewService.map, location);
        }
    }
    function createContent(poi) {  //��Ϣ��������
        var s = [];
        s.push('<div class="info-title">' + poi.name + '</div><div class="info-content">' + "��ַ��" + poi.address);
        s.push("�绰��" + poi.tel);
        s.push("���ͣ�" + poi.type);
        s.push('<div>');
        return s.join("<br>");
    }


    console.info("loaded")

}).catch((e) => {
    console.error(e);
});
window.initObjRef = function (objRef) {
    window.objRef = objRef;
}

