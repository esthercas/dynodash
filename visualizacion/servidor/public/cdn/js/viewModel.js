
/**
 * Esta función es el homologo de BiganStructure. Se basa en knockout.js y sirve para dar dinamismo y funcionalidad a la web y a sus componentes.
 */

let myViewModel = new function () {

    //Variable para el contexto
    let self = this

    let globalAS = ko.observable();
    let globalZBS = ko.observable();
    let globalYear = ko.observable();
    let globalDate = ko.observable();
    let globalDetail = ko.observable("global");

    let globalAggLevel = ko.observable(); //Almacena el nivel de agregación espacial que se está visualizando
    let globalIndicador = ko.observable(); //Almacena el indicador que se está visualizando
    
    let selectedSectores = ko.observableArray([]); //Almacena los codigos de los sectores que se han seleccionado
    let datos_selected_sectores = ko.observableArray([]) //Almacena todos los datos de los sectores que se han seleccionado
    let sector_seleccionado = ko.observable(null); //Almacena los datos del sector del mapa donde se encuentra el raton
    let opcionesIndicadores = ko.observableArray([]); //Almacena los distintos indicadores con sus respectivos subindicadores que se pueden seleccionar en un dashboard
    let datos = ko.observableArray([]) //Almacena los datos de los sectores para un indicador específico.
    let perfil = ko.observableArray([]) // Almacena los datos de cada sector utilizados para desplegar su perfil de desempeño
    

    /*
    Objeto que almacena en cada una de sus propiedades los datos de los sectores en función del tipo de dashboard que se está visualizando.
    Los datos guardados en el array tendrán la siguiente estructura : {"code": undifine,"value": null, "values": []}
    */
    let datos_object = {
        datos_G: [],
        datos_H: [],
        datos_M: [],
        datos_65_79: [],
        datos_80: [],
        datos_Perfil: []
    }

    //Objeto que almacena los codigos de cada sector
    let ambito = ko.observable(); //Almacena el ambito del mapa (España, Aragon, etc));
    let ambito_object = {
        andalucia_zbs : [11708, 13001, 10502, 12906, 11803, 10506, 11102, 12103, 11103, 13003, 11607, 12005, 11606, 11602, 12802, 10603, 12101, 11404, 11802, 10802, 12704, 12007, 12904, 10804, 10507, 10201, 12301, 12701, 12605, 13118, 12908, 11403, 12303, 13110, 10907, 12607, 11902, 13304, 10801, 10904, 11401, 10304, 12305, 12105, 12911, 11204, 10206, 12905, 11805, 10702, 10909, 11104, 11206, 11601, 11201, 11305, 11105, 13107, 12006, 11304, 11603, 12210, 12902, 10102, 12601, 12901, 12004, 10202, 11605, 13101, 11804, 10306, 12603, 12907, 12805, 13103, 12311, 11801, 10901, 12909, 11604, 10605, 12207, 13116, 10903, 11903, 12310, 10209, 12604, 10104, 10505, 12506, 13114, 11205, 13112, 10905, 12201, 10704, 10409, 11303, 12910, 13301, 12504, 12502, 11207, 12203, 13105, 12912, 12312, 13111, 12001, 11106, 12606, 11707, 13109, 13106, 10407, 10401, 10503, 12211, 11301, 10101, 10301, 10501, 10203, 12212, 11701, 12903, 12602, 12702, 13303, 12804, 11703, 12205, 10305, 13117, 10508, 10403, 11501, 13302, 10103, 10807, 12209, 12206, 12507, 13115, 12306, 10302, 12401, 10105, 12505, 13113, 12308, 13102, 10408, 10604, 11302, 11202, 12503, 12003, 10803, 11705, 13104, 10405, 11806, 13108, 10406, 12002, 10703, 10208, 11307, 11706, 10601, 10204, 10205, 11101, 12102, 10504, 12213, 12501, 10303, 12202, 12803, 12106, 12703, 10805, 13002, 12204, 11306, 12801, 12208, 10207, 10402, 11502, 10606, 10806, 10906, 12307, 10602, 13305, 11402, 12302, 12304, 13201, 12104, 10908, 11001, 11702, 11904, 10404, 11901, 10701, 11203, 12309, 10902, 11704],
        cataluña_zbs : [647395, 660082, 607304, 663366, 657125, 671077, 625293, 658005, 657127, 622254, 652208, 648165, 608013, 670076, 633010, 635104, 657101, 624109, 664202, 605379, 625297, 647381, 651080, 646035, 670048, 624290, 609107, 633353, 671019, 601233, 664204, 667376, 663265, 646023, 624294, 630280, 659159, 659200, 669285, 668230, 624214, 671017, 646033, 666363, 607324, 630362, 656142, 649256, 670358, 651119, 651133, 637180, 670030, 653083, 647058, 605232, 624210, 630368, 605329, 635320, 607188, 646039, 619371, 648246, 606263, 663122, 605136, 607306, 605181, 624296, 606162, 650260, 630342, 646025, 635322, 609339, 647050, 665367, 651189, 653347, 662393, 603179, 666390, 655093, 670028, 635192, 605106, 624369, 647054, 633157, 635194, 669164, 647056, 665149, 619372, 658234, 630223, 624216, 666248, 604007, 635345, 633155, 635196, 647062, 670067, 601169, 635198, 647064, 662394, 619337, 668175, 635387, 605086, 635190, 630225, 668300, 630273, 605140, 633153, 609364, 667207, 605138, 607087, 622253, 666252, 609166, 647070, 666250, 669095, 609340, 630277, 664374, 650206, 647060, 624110, 630281, 619338, 665115, 605001, 647046, 609240, 669287, 633186, 605003, 630275, 625183, 625298, 609244, 649328, 603259, 607354, 657231, 662380, 659237, 646040, 649178, 669355, 646042, 607091, 622350, 630283, 662316, 646044, 609352, 625288, 659011, 671331, 662235, 609242, 624116, 657015, 652172, 654187, 625292, 619229, 619269, 624160, 608357, 606262, 654343, 671078, 666388, 670075, 635105, 646032, 671020, 670049, 607118, 624291, 622212, 630279, 651134, 663123, 659146, 647382, 605334, 646022, 659148, 669121, 661268, 624295, 669315, 605161, 607112, 633335, 671072, 609239, 668349, 665201, 655336, 622238, 663373, 646021, 661218, 647385, 670065, 654092, 659211, 607305, 663365, 649113, 633009, 663266, 657124, 671074, 657126, 624213, 668391, 651114, 666251, 624108, 665168, 671016, 659215, 664203, 670047, 646034, 658008, 646036, 647396, 666309, 622144, 670027, 624261, 665360, 671018, 664205, 602103, 633271, 670051, 646024, 660130, 648120, 630276, 630361, 605245, 670029, 603174, 650004, 668348, 670031, 633156, 622102, 624209, 647059, 670326, 652084, 647063, 630341, 633154, 646038, 668150, 666389, 633158, 607303, 633152, 607307, 630319, 649255, 653171, 659096, 646043, 630272, 665370, 647069, 655143, 622185, 658330, 619131, 647061, 605135, 666249, 658221, 651267, 625184, 605081, 624117, 659098, 605137, 653346, 625182, 652258, 607163, 630226, 647053, 630274, 662317, 635193, 647055, 647057, 655090, 666247, 609257, 635384, 630311, 635197, 625289, 635344, 609243, 605139, 630222, 609241, 635386, 652173, 630224, 666378, 605141, 658100, 635191, 661176, 619228, 666356, 608314, 605129, 606333, 671079, 622377, 619088, 664375, 622217, 647327, 630282, 659219, 670052, 669284, 659145, 660128, 651177, 605002, 605014, 625299, 669286, 646383, 659236, 659147, 671312, 646041, 658199, 624111, 666310, 622351, 605012, 646045, 668392, 635097, 671073, 662359, 668089, 659167, 671071, 656085, 655325],
        canarias_zbs : [70114, 70115, 70116, 70117, 70110, 70111, 70112, 70113, 70118, 70119, 70509, 70508, 70507, 70506, 70505, 70504, 70503, 70502, 70501, 70201, 70202, 70203, 70204, 70205, 70301, 70303, 70302, 70305, 70304, 70307, 70306, 70604, 70605, 70601, 70602, 70603, 70415, 70414, 70417, 70416, 70411, 70410, 70413, 70412, 70701, 70419, 70418, 70702, 70406, 70407, 70404, 70405, 70402, 70403, 70401, 70408, 70409, 70433, 70432, 70431, 70430, 70437, 70436, 70435, 70434, 70439, 70438, 70129, 70128, 70125, 70124, 70127, 70126, 70121, 70120, 70123, 70122, 70428, 70429, 70424, 70425, 70426, 70427, 70420, 70421, 70422, 70423, 70138, 70136, 70137, 70134, 70135, 70132, 70133, 70130, 70131, 70109, 70108, 70103, 70102, 70101, 70107, 70106, 70105, 70104],
        paisVasco_zbs : [40167, 40101, 40102, 40103, 40104, 40105, 40106, 40108, 40111, 40113, 40116, 40117, 40118, 40119, 40120, 40121, 40126, 40127, 41001, 41002, 41003, 41004, 41005, 41006, 41008, 41109, 41010, 41111, 41112, 41013, 41014, 41015, 41016, 41017, 41018, 41019, 41020, 41021, 41023, 41024, 41025, 40702, 41096, 40204, 40805, 40806, 40807, 40208, 40709, 40710, 40711, 40712, 41097, 40814, 40215, 40816, 41098, 40218, 41099, 40820, 40601, 40603, 40604, 40605, 40606, 40607, 40608, 40609, 40610, 40611, 40612, 40613, 40614, 40615, 40616, 40617, 40618, 40621, 40624, 40301, 40302, 40303, 40304, 40305, 40306, 40307, 40308, 40309, 40310, 40311, 40312, 40313, 40314, 40315, 40316, 40317, 40899, 40402, 40403, 40404, 40405, 40406, 40408, 40409, 40410, 40411, 40412, 40501, 40503, 40904, 40505, 40906, 40907, 40908, 40510, 40511, 40512, 40913, 40515, 40516, 40917, 40518, 40919, 40920, 40521, 40922, 40147, 40699, 40628, 40633, 40538, 40199, 40110, 40107, 41095],
        cantabria_zbs: [140101, 140102, 140103, 140104, 140105, 140106, 140107, 140108, 140109, 140110, 140111, 140112, 140113, 140114, 140115, 140116, 140117, 140118, 140119, 140120, 140201, 140202, 140204, 140205, 140206, 140207, 140208, 140209, 140413, 140401, 140402, 140403, 140404, 140405, 140406, 140407, 140408, 140409, 140410, 140411, 140412, 140203],
        aragon_zbs: [20901, 20907, 20114, 20106, 20507, 20104, 20619, 20910, 20905, 20519, 20804, 20615, 20613, 20410, 20908, 20802, 20909, 20704, 20626, 20409, 20617, 20401, 20624, 20903, 20402, 20611, 20412, 20505, 20628, 20906, 20414, 20815, 20202, 20911, 20204, 20817, 20806, 20113, 20618, 20109, 20614, 20904, 20805, 20521, 20612, 20622, 20516, 20621, 20213, 20808, 20206, 20620, 20627, 20406, 20211, 20902, 20208, 20803, 20811, 20625, 20404, 20523, 20403, 20110, 20209, 20812, 20201, 20112, 20510, 20203, 20215, 20801, 20512, 20616, 20108, 20205, 20814, 20807, 20525, 20813, 20103, 20809, 20520, 20101, 20515, 20503, 20604, 20407, 20210, 20207, 20623, 20701, 20405, 20509, 20601, 20703, 20810, 20522, 20517, 20709, 20602, 20111, 20107, 20711, 20511, 20214, 20710, 20105, 20513, 20524, 20254, 20518, 20504, 20912, 20603, 20705, 20413, 20102, 20706, 20707, 20408, 20508, 20702],
        madrid_zbs: [160205, 160614, 160529, 160305, 160908, 160106, 160119, 160702, 160404, 160212, 160131, 160518, 160802, 161110, 160303, 160515, 161006, 160530, 160203, 161112, 160301, 160122, 161004, 160517, 160910, 160118, 160120, 160414, 160214, 160622, 161108, 160309, 161132, 161128, 160413, 160811, 161114, 161122, 160612, 160505, 160822, 160522, 160422, 161109, 160715, 160127, 160201, 160507, 161103, 160919, 160706, 161003, 160717, 161013, 160211, 160114, 161101, 160109, 160704, 161130, 160415, 160918, 160419, 161116, 161009, 160208, 160207, 160806, 160819, 160410, 160104, 160215, 160402, 161107, 160909, 161001, 160105, 160807, 160213, 160409, 160130, 160204, 160720, 160514, 160603, 160112, 160711, 160703, 160202, 161111, 160601, 161005, 160713, 161125, 160116, 161105, 161113, 160611, 160123, 161123, 160503, 160812, 161115, 160121, 160607, 160608, 160313, 160519, 160523, 160701, 160813, 160502, 160535, 160521, 160508, 160707, 160714, 160128, 160418, 161118, 160315, 161102, 160705, 160815, 160132, 161117, 160605, 160613, 160533, 161010, 160510, 161104, 161127, 160805, 161106, 160407, 160206, 160716, 160412, 160804, 160511, 161133, 160721, 160317, 160904, 160710, 160102, 160408, 160319, 160602, 160906, 160712, 160531, 161011, 160115, 160617, 161119, 161135, 161008, 160609, 160311, 160516, 160525, 161121, 160808, 160124, 160619, 160809, 160113, 160501, 160524, 160306, 160534, 160312, 160719, 160117, 160917, 160616, 160111, 160304, 160314, 160621, 160509, 160915, 161137, 160606, 161012, 160411, 160604, 160902, 161136, 160708, 161007, 160108, 160820, 160406, 160513, 160913, 160101, 160620, 160129, 160801, 160512, 160316, 161014, 160405, 160914, 160103, 161124, 160803, 160302, 160818, 160905, 160821, 160816, 160318, 161120, 160911, 160907, 161131, 160520, 160810, 160420, 161129, 160125, 160526, 160901, 160308, 160532, 160310, 160216, 161134, 160817, 160416, 160504, 160527, 160421, 160528, 161002, 160718, 160126, 160110, 160506, 160307, 160210, 160916, 160401, 160615, 161126, 160903, 160417, 160610, 160403, 160209, 160107, 160618, 160814, 160912, 160709],
        castillaLeon_zbs: [170514, 171116, 170615, 170801, 170101, 170926, 171119, 170207, 170617, 170803, 170103, 171008, 170612, 170205, 170512, 170405, 170609, 170505, 170625, 170203, 171002, 170611, 170601, 170214, 170507, 171110, 170303, 170906, 170111, 170117, 170312, 170510, 170520, 170218, 170712, 170325, 171015, 170304, 171105, 170713, 170327, 171112, 170636, 170928, 170314, 171103, 170519, 170516, 170618, 170807, 171022, 170316, 170914, 170321, 171109, 170607, 170301, 170602, 170307, 170806, 170219, 170614, 170102, 171025, 170502, 170909, 171014, 171001, 170501, 170513, 170309, 170616, 170504, 170116, 170503, 170710, 170610, 170323, 170407, 170506, 170509, 171114, 170814, 170310, 171016, 170903, 171021, 170402, 170313, 170705, 170919, 170231, 170110, 170511, 170702, 170608, 171009, 170404, 170212, 170118, 170703, 170121, 170326, 170318, 170106, 170714, 170315, 170701, 170915, 170804, 170320, 170517, 170411, 171013, 170220, 170208, 170805, 170107, 170406, 170206, 170222, 170920, 170623, 170224, 170605, 170810, 170227, 170408, 171024, 170629, 170317, 170620, 170322, 170305, 170308, 171026, 171018, 170708, 170311, 170622, 171003, 170229, 170410, 170902, 170112, 170809, 170603, 170109, 170508, 170619, 170704, 171120, 171108, 170707, 170113, 170711, 170403, 170515, 170709, 170234, 171118, 170604, 170628, 171012, 170122, 171017, 170633, 170120, 170211, 170319, 170119, 170808, 170910, 171011, 170631, 170924, 171006, 170213, 170105, 170715, 171007, 170209, 170235, 171117, 170104, 170925, 171023, 170114, 170233, 170221, 170204, 170302, 170802, 170627, 170201, 170217, 170624, 170613, 170223, 170324, 170621, 170409, 170626, 170226, 171111, 171019, 170202, 170907, 170306, 170706, 170215, 171113, 170108, 170812, 170401, 170216, 171106, 171010, 170813, 171121, 171104, 170716, 170811, 170634, 171101, 170637, 171107, 170230, 171122, 170606, 170115, 170635, 170236, 171102, 170913, 170630, 170518, 171115, 171020, 170225, 170927, 170228, 170210, 170232],
        castillaLaMancha_zbs: [150302, 150527, 150437, 150713, 150413, 150401, 150326, 150525, 150420, 150435, 150407, 150202, 150324, 150709, 150418, 150422, 150311, 150322, 150808, 150708, 150309, 150722, 150415, 150317, 150511, 150304, 150516, 150806, 150720, 150807, 150405, 150416, 150604, 150433, 150425, 150729, 150410, 150211, 150319, 150431, 150306, 150110, 150520, 150717, 150112, 150208, 150515, 150715, 150403, 150204, 150427, 150412, 150617, 150206, 150421, 150330, 150436, 150203, 150134, 150510, 150118, 150423, 150103, 150809, 150308, 150522, 150602, 150101, 150719, 150725, 150414, 150434, 150802, 150701, 150605, 150428, 150432, 150117, 150614, 150703, 150210, 150114, 150123, 150430, 150613, 150111, 150718, 150507, 150116, 150213, 150611, 150113, 150209, 150505, 150438, 150710, 150509, 150132, 150524, 150329, 150728, 150616, 150109, 150521, 150205, 150130, 150104, 150705, 150135, 150107, 150119, 150321, 150207, 150102, 150707, 150105, 150529, 150201, 150601, 150517, 150518, 150129, 150724, 150603, 150125, 150803, 150314, 150608, 150429, 150727, 150127, 150801, 150607, 150122, 150503, 150214, 150523, 150730, 150506, 150115, 150501, 150312, 150212, 150121, 150612, 150504, 150310, 150711, 150610, 150328, 150327, 150303, 150702, 150108, 150508, 150712, 150133, 150325, 150704, 150526, 150320, 150131, 150406, 150706, 150723, 150419, 150106, 150305, 150323, 150512, 150721, 150128, 150805, 150316, 150528, 150307, 150606, 150519, 150417, 150315, 150804, 150424, 150726, 150404, 150124, 150318, 150513, 150409, 150609, 150426, 150126, 150411, 150716, 150514, 150502, 150408, 150120, 150714, 150402, 150301, 150313, 150615],
        navarra_zbs: [0, 80101, 80102, 80103, 80104, 80105, 80106, 80107, 80108, 80109, 80110, 80111, 80112, 80113, 80114, 80115, 80116, 80117, 80118, 80119, 80120, 80121, 80122, 80123, 80124, 80125, 80126, 80127, 80128, 80129, 80130, 80131, 80332, 80333, 80334, 80335, 80336, 80337, 80338, 80339, 80140, 80141, 80142, 80143, 80144, 80245, 80246, 80247, 80248, 80249, 80250, 80251, 80161, 80163, 80164, 80166, 80167],
        asturias_zbs: [30604, 30602, 30418, 30801, 30419, 30605, 30501, 30661, 30415, 30606, 30508, 30223, 30509, 30443, 30303, 30513, 30806, 30414, 30444, 30601, 30417, 30401, 30506, 30302, 30301, 30304, 30101, 30805, 30305, 30804, 30511, 30309, 30410, 30111, 30411, 30441, 30504, 30507, 30512, 30306, 30308, 30307, 30113, 30803, 30881, 30112, 30104, 30420, 30201, 30105, 30222, 30406, 30114, 30202, 30704, 30514, 30802, 30310, 30409, 30407, 30408, 30115, 30510, 30404, 30412, 30102, 30413, 30706, 30705, 30505, 30221, 30701, 30405, 30662, 30403, 30603, 30402, 30442, 30103, 30502, 30702, 30503, 30116, 30703],
        baleares_zbs: [100307, 100503, 100306, 100111, 100507, 100504, 100508, 100514, 100202, 100501, 100605, 100110, 100113, 100604, 100408, 100407, 100409, 100606, 100406, 100405, 100101, 100302, 100102, 100401, 100404, 100601, 100203, 100107, 100106, 100103, 100402, 100403, 100105, 100201, 100104, 100108, 100511, 100303, 100112, 100509, 100603, 100109, 100510, 100305, 100505, 100304, 100602, 100516, 100506, 100204, 100512, 100205],
        valencia_zbs: [50101, 50102, 50103, 50104, 50105, 50106, 50107, 0, 50201, 50202, 50203, 50204, 50205, 50206, 50207, 50208, 50209, 50210, 50211, 50212, 50213, 50214, 50215, 50216, 50217, 50301, 50302, 50303, 50304, 50305, 50306, 50307, 50308, 50309, 50401, 50402, 50403, 50404, 50405, 50406, 50407, 50408, 50409, 50410, 0, 50501, 50502, 50503, 50504, 50505, 50506, 50507, 50508, 50509, 50510, 50511, 50512, 50513, 50514, 50515, 50516, 50601, 50602, 50603, 50604, 50605, 50606, 50607, 50608, 50609, 50610, 50611, 50612, 50614, 50615, 50616, 50617, 52309, 50708, 50709, 50710, 50711, 50712, 50713, 50714, 50715, 50716, 50717, 50718, 50801, 50802, 50803, 50804, 50805, 50901, 50903, 50904, 50905, 50906, 50907, 50908, 50909, 50910, 50911, 50912, 50913, 50914, 50915, 51003, 51004, 51007, 51009, 51010, 51011, 51012, 51013, 51014, 51015, 51016, 51101, 51102, 51103, 51104, 51105, 51106, 51107, 51108, 51109, 51110, 51111, 51201, 51202, 51203, 51204, 51205, 51206, 51207, 51208, 51301, 51302, 51303, 51304, 51305, 51306, 51307, 51308, 51309, 51310, 51311, 51401, 51402, 51403, 51404, 51405, 51406, 51407, 51408, 51409, 51410, 51411, 51412, 51413, 51414, 51415, 51416, 51417, 51501, 51502, 51503, 51504, 51505, 51506, 51507, 51508, 51509, 51510, 0, 51601, 51602, 51603, 51604, 51605, 51606, 51607, 51701, 51702, 51703, 51704, 51705, 51706, 51707, 51708, 51709, 51802, 51803, 51804, 51805, 51806, 51807, 51808, 51809, 51810, 51901, 51902, 51903, 51904, 51905, 51906, 51907, 51908, 51909, 51910, 52004, 52005, 52006, 52008, 52009, 52010, 52101, 52102, 52103, 52104, 52105, 52106, 52107, 52201, 52202, 52203, 52204, 52205, 52301, 52302, 52303, 52304, 52305, 52306, 52307, 52308, 52401, 52402, 52403, 52404, 52405, 52406],
        galicia_zbs : [111301, 111302, 111303, 111304, 111305, 111306, 111307, 111308, 111309, 111501, 111102, 111103, 110804, 110805, 110806, 110807, 110801, 110802, 110803, 111104, 111313, 111312, 111311, 111310, 110310, 111212, 111210, 111005, 110309, 110308, 110307, 110306, 110305, 110304, 110303, 110302, 110301, 110905, 111207, 110904, 110906, 110901, 111211, 110903, 110902, 111602, 110703, 110702, 110701, 110707, 110706, 110705, 110704, 110206, 110207, 110204, 110205, 110202, 110203, 110201, 110208, 110209, 110919, 110502, 110916, 110917, 110914, 110915, 110912, 110913, 110910, 110911, 111003, 111002, 111001, 111203, 110918, 111004, 111202, 110501, 111205, 110503, 110115, 110112, 110113, 110110, 110111, 110215, 110214, 110217, 110216, 110211, 110210, 110213, 110212, 111206, 110219, 110218, 110602, 110603, 110907, 110601, 110606, 110607, 110604, 110605, 110608, 110609, 110909, 110908, 111209, 111208, 110109, 110108, 110105, 110104, 110107, 110106, 110101, 111204, 110103, 110102, 110220, 111701, 110611, 110610, 110613, 111101, 110615, 110614, 110617, 110616, 110619, 110618, 110114, 110401, 110402, 110403, 110404, 111601, 111603, 110504, 111201, 110624, 111502, 110920, 110620, 110621, 110622, 110623],
        laRioja_zbs : [130110, 130111, 130113, 130109, 130108, 130107, 130106, 130105, 130104, 130103, 130102, 130101, 130112],
        extremadura_zbs: [120119, 120118, 120449, 120448, 120115, 120114, 120117, 120116, 120111, 120110, 120113, 120112, 120681, 120680, 120129, 120232, 120528, 120227, 120226, 120225, 120224, 120223, 120222, 120220, 120793, 120555, 120557, 120556, 120799, 120798, 120797, 120796, 120794, 120559, 120792, 120558, 120447, 120333, 120335, 120334, 120337, 120130, 120339, 120338, 120560, 120564, 120565, 120566, 120567, 120568, 120569, 120821, 120143, 120574, 120573, 120572, 120570, 120890, 120891, 120895, 120887, 120886, 120885, 120884, 120883, 120882, 120231, 120889, 120888, 120771, 120678, 120679, 120675, 120676, 120677, 120450, 120451, 120452, 120453, 120454, 120340, 120341, 120342, 120344, 120345, 120446, 120876],
        murcia_zbs: [90707, 90110, 90106, 90804, 90608, 90612, 90404, 90401, 90708, 90706, 90709, 90111, 90605, 90705, 90609, 90607, 90108, 90701, 90403, 90402, 90704, 90614, 90702, 90606, 90703, 90210, 90109, 90101, 90801, 90501, 90212, 90211, 90207, 90903, 90206, 90303, 90603, 90103, 90601, 90902, 90901, 90205, 90302, 90204, 90102, 90202, 90208, 90304, 90105, 90613, 90305, 90610, 90107, 90209, 90306, 90502, 90203, 90104, 90602, 90213, 90611, 90301, 90112, 90604, 90802, 90216, 90405, 90201, 90710, 90214, 90406, 90215, 90113, 90803],
    }
    
    //Objecto que almacena en cada una de sus propiedades el tipo de dashboard que se está visualizando.
    let variabilidad = ko.observable();
    let variabilidad_object = {
        general: undefined,
        hombre: undefined,
        mujer: undefined,
        edad_65_79: undefined,
        edad_80: undefined,
        perfil: undefined
    }

    let totalidadIndicadores = []; //Almacena todos los subindicadores


    const DETAIL1 = "global";
    const DETAIL2 = "as";
    const DETAIL3 = "zbs";
    const DETAIL4 = "hospital";



    let aggLevel = { codigo: "", descripcion: "" };
    let aggLevels = ko.observableArray([]); //Variable que almacena los niveles de agregación

    let indicador = { id: "", nombre: "" }
    let indicadores = ko.observableArray([]); //Variable que almacena los subindicadores

    //Funcion que se usa para fijar el tipo de dashboard que se está visualizando
    let setVariabilidad = function (label) {

        if (label) {
            variabilidad(label)
        }else{
            variabilidad("General")
        }
        
        if (variabilidad() == 'General') {
            variabilidad_object.general = variabilidad()
        }
        if (variabilidad() == 'Hombre') {
            variabilidad_object.hombre = variabilidad()
        }
        if (variabilidad() == 'Mujer') {
            variabilidad_object.mujer = variabilidad()
        }
        if (variabilidad() == 'Edad_65_79') {
            variabilidad_object.edad_65_79 = variabilidad()
        }
        if (variabilidad() == 'Edad_80') {
            variabilidad_object.edad_80 = variabilidad()
        }
        if (variabilidad() == 'Perfil') {
            variabilidad_object.perfil = variabilidad()
        }
    }



    // cada vez que cambie la variabilidad se recuperaran los datos de la BBDD
    // y se enviaran a setData
    variabilidad.subscribe(function () {

        var container = document.getElementById('map');
        var url_datos = container.getAttribute('data-url');

        return $.ajax({
            dataType: "json",
            type: "GET",
            url: url_datos,
        }).then(function (data) {
            ambito(data[0].ambito);
            data = data[0].data;
            setData(variabilidad(), data)
        })

    })


    /*
        Funcion que se usa para fijar los datos que se van a visualizar.
        Su almacenamiento depende del tipo de dashboard.
        Modifica el observable datos()
    */
    let setData = function (variabilidad, data) {
        if (variabilidad == 'General') {
            datos_object.datos_G = [];
            datos_object.datos_G.push(...data)
            datos(data)
        }
        if (variabilidad == 'Hombre') {
            datos_object.datos_H = [];
            datos_object.datos_H.push(...data)
            datos(data)
        }
        if (variabilidad == 'Mujer') {
            datos_object.datos_M = [];
            datos_object.datos_M.push(...data)
            datos(data)

        }
        if (variabilidad == 'Edad_65_79') {
            datos_object.datos_65_79 = []
            datos_object.datos_65_79.push(...data)
            datos(data)
        }
        if (variabilidad == 'Edad_80') {
            datos_object.datos_80 = []
            datos_object.datos_80.push(...data)
            datos(data)
        }
        if (variabilidad == 'Perfil') {
            datos_object.datos_Perfil = []
            datos_object.datos_Perfil.push(...data)
            datos(data)
        }
    }


    /**
     * Funcion que fija el indicador que se va a visualizar
     * @param {*} indicador 
     */
    let setIndicador = function (indicador) {
        if (indicador != undefined) {
            globalIndicador(indicador.id)
        }
    }

    /**
     * Funcion que devuelve el indicador que se va a visualizar
     * @returns 
     */
    let getIndicador = function () {
        let indicador = globalIndicador();
        //console.log('en getIndicador', indicador)
        return indicador ? indicador : '';
    }

    /**
     * Funcion que fija el nivel de agregación que se va a visualizar
     * @param {*} aggLevel 
     */
    let setAggLevel = function (aggLevel) {
        if (aggLevel != undefined) {
            globalAggLevel(aggLevel.codigo)
        }
    }

    /**
     * Funcion que devuelve el nivel de agregación que se va a visualizar
     * @returns 
     */
    let getAggLevel = function () {
        let aggLevel = globalAggLevel();
        return aggLevel ? aggLevel : '';
    };

    /**
     * Funcion que complementa a la funcion setDataAggLevels()
     * @param {*} c 
     * @param {*} d 
     */
    function addAggLevel(c, d) {
        aggLevels.push({ codigo: c, descripcion: d })
    }


    /**
     * Funcion para annadir los distintos niveles de agregación cargados de base de datos
     * También fija el nivel de agregación que se visualizará por defecto
     * @param {*} response 
     */
    let setDataAggLevels = function (response) {
        let data = response.aggLevels
        aggLevels.removeAll();
        //
        $.each(data, function (index, aggLevel) {
            addAggLevel(aggLevel.codigo, aggLevel.descripcion)
        });
        globalAggLevel(aggLevels()[0].codigo)
    };

    /**
     * En esta función se añaden los indicadores a un observableArray
     * También se añaden todos los subindicadores a otro array 
    */
    let setDataIndicadores = function (response) {
        opcionesIndicadores(response);

        totalidadIndicadores = response.flatMap((item) =>
            item.indicadores.flatMap((indicador) => indicador.subindicadores)
        );

    }

    /**
     * Funcion que complementa a la funcion elegirIndicadores()
     * @param {*} i 
     */
    function addIndicador(i) {
        indicadores.push(i)
    }


    /**
     * Esta funcion es un computed observable.
     * 
     * Devuelve las distintas opsiones de indicadores que se visualizan en un dashboard en base al nivel de agregación seleccionado.
     */
    let elegirIndicadores = ko.computed(function () {
        if (opcionesIndicadores().length != 0) {
            indicadores.removeAll()
            perfil.removeAll()

            let data = opcionesIndicadores().find(element => element.escala === globalAggLevel()).indicadores

            $.each(data, function (index, indicador) {
                addIndicador(indicador)
            })

            /*let dataSubindicadores = data[0].subindicadores;

            $.each(dataSubindicadores, function (index, subindicador) {
                addSubindicador(subindicador)
            })*/

            return indicadores;
        }

    });


    /**
     * Este método actúa de la siguiente manera:
     *  Si el indicador global no está definido entonces lo define añadiendo el primer valor de la lista.
     *  Cuando el indicador ya está seleccionado y se cambia de escala, se asigna el valor de este indicador pero para la otra escala.
     * De esta forma cuando se cambie de nivel de agregación, siempre se visualizará el indicador que se encuentre al mismo nivel en la lista de indicadores del dashboard.
    */
    elegirIndicadores.subscribe(function () {
        //console.log('se ejecuta')
        if (!globalIndicador()) {
            globalIndicador(indicadores()[0].subindicadores[0].id)
        } else {

            let namePreviosIndicador = totalidadIndicadores.find(item => item.id == globalIndicador()).nombre

            let idCurrentIndicador;

            indicadores().some((indicador) =>
                indicador.subindicadores.some((subindicador) => {
                    if (subindicador.nombre === namePreviosIndicador) {
                        idCurrentIndicador = subindicador.id;
                        return true;
                    }
                })
            );

            globalIndicador(idCurrentIndicador)
        }
    })


    let area_sanitaria = { codigo: undefined, nombre: "", value: undefined };

    /*
        Objeto que almacena en cada una de sus propiedades los datos de las areas sanitarias separados por el tipo de variabiliadad
        El as almacenada tiene la siguiente estructura: { codigo: undefined, nombre: "", value: undefined }
    */
    let areas_sanitarias_object = {
        general: ko.observableArray([]),
        hombre: ko.observableArray([]),
        mujer: ko.observableArray([]),
        edad_65_79: ko.observableArray([]),
        edad_80: ko.observableArray([]),
        perfil: ko.observableArray([])
    }

    //Estas funciones annaden cada una de las areas sanitarias a los observables arrays dentro del objeto areas_sanitarias 
    function addASG(c, d, v) {
        areas_sanitarias_object.general.push({ codigo: c, nombre: d, value: v })
    }

    function addASH(c, d, v) {
        areas_sanitarias_object.hombre.push({ codigo: c, nombre: d, value: v })
    }

    function addASM(c, d, v) {
        areas_sanitarias_object.mujer.push({ codigo: c, nombre: d, value: v })
    }

    function addAS_65_79(c, d, v) {
        areas_sanitarias_object.edad_65_79.push({ codigo: c, nombre: d, value: v })
    }

    function addAS_80(c, d, v) {
        areas_sanitarias_object.edad_80.push({ codigo: c, nombre: d, value: v })
    }

    function addAS_Perfil(c, d, v) {
        areas_sanitarias_object.perfil.push({ codigo: c, nombre: d, value: v })
    }

    //obtener las areas sanitarias de la base de datos
    function getAS() {
        return $.ajax({
            dataType: "json",
            type: "GET",
            url: "https://gist.githubusercontent.com/AleOG/1ea3da77ddbc4f8085a012a76ccadde8/raw/88f79d2102a8597f52209c998015c24da5b3f0e5/AREA_ESP_WGS84.json",
        }).then(function (data) {
            return data.objects.AREA_ESP_WGS84.geometries;
        })
    }

    //Esta funcion vacia los arrays del objeto areas_sanitarias y annade el codigo y el nombre de cada una de las areas sanitarias obtenidas de getAS()
    var callbackAS = function (response) {
        areas_sanitarias_object.general.removeAll();
        areas_sanitarias_object.hombre.removeAll();
        areas_sanitarias_object.mujer.removeAll();
        areas_sanitarias_object.edad_65_79.removeAll();
        areas_sanitarias_object.edad_80.removeAll();
        areas_sanitarias_object.perfil.removeAll();
        $.each(response, function (index, item) {
            if (item.properties.M1D === ambito()) { //Solo añade los items que pertenezcan a una comunidad autonoma (por ejemplo Aragon)
                addASG(item.properties.IDN, item.properties.M3D)
                addASH(item.properties.IDN, item.properties.M3D)
                addASM(item.properties.IDN, item.properties.M3D)
                addAS_65_79(item.properties.IDN, item.properties.M3D)
                addAS_80(item.properties.IDN, item.properties.M3D)
                addAS_Perfil(item.properties.IDN, item.properties.M3D)
            } else if (ambito() === "España"){
                addASG(item.properties.IDN, item.properties.M3D)
                addASH(item.properties.IDN, item.properties.M3D)
                addASM(item.properties.IDN, item.properties.M3D)
                addAS_65_79(item.properties.IDN, item.properties.M3D)
                addAS_80(item.properties.IDN, item.properties.M3D)
                addAS_Perfil(item.properties.IDN, item.properties.M3D)
            }
        });
        //console.log('callback areas', areas_sanitarias_object.mujer())
        //setAS(false)
    };

    //No se usa todavía
    var setAS = function (s) {
        if (!s) {
            globalSector(undefined)
        }
        else {
            var t = ko.utils.arrayFirst(areas_sanitarias(), function (f) {
                return f.codigo == s
            });

            if (t && (!globalSector() || s != globalSector().codigo)) {
                globalSector(t)
            }
        }
    };

    let zona_bas_salud = { codigo: undefined, nombre: "", value: undefined };

    /*
    Objeto que almacena en cada una de sus propiedades los datos de las zonas básicas de salud separados por el tipo de variabiliadad
    El zbs almacenada tiene la siguiente estructura: { codigo: undefined, nombre: "", value: undefined }
    */
    let zonas_bas_salud_object = {
        general: ko.observableArray([]),
        hombre: ko.observableArray([]),
        mujer: ko.observableArray([]),
        edad_65_79: ko.observableArray([]),
        edad_80: ko.observableArray([]),
        perfil: ko.observableArray([])
    };


    //Estas funciones annaden cada una de las zonas básicas de salud a los observables arrays dentro del objeto zonas_bas_salud
    function addZBSG(c, d, v) {
        zonas_bas_salud_object.general.push({ codigo: c, nombre: d, value: v })
    }

    function addZBSH(c, d, v) {
        zonas_bas_salud_object.hombre.push({ codigo: c, nombre: d, value: v })
    }

    function addZBSM(c, d, v) {
        zonas_bas_salud_object.mujer.push({ codigo: c, nombre: d, value: v })
    }

    function addZBS_65_79(c, d, v) {
        zonas_bas_salud_object.edad_65_79.push({ codigo: c, nombre: d, value: v })
    }

    function addZBS_80(c, d, v) {
        zonas_bas_salud_object.edad_80.push({ codigo: c, nombre: d, value: v })
    }

    function addZBS_Perfil(c, d, v) {
        zonas_bas_salud_object.perfil.push({ codigo: c, nombre: d, value: v })
    }


    //obtener las zonas básicas de salud de la base de datos
    function getZBS() {
        //console.log('llamaada a zonas')
        return $.ajax({
            dataType: "json",
            type: "GET",
            url: "https://gist.githubusercontent.com/AleOG/f7bfa242f4534e806cf24c29677586fd/raw/0b18b9aa2e7bf56e5557c9af06bf7d3f31ce3735/ZBS_ESP_WGS84.json",
        }).then(function (data) {
            return data.objects.ZBS_ESP_WGS84.geometries
        })
    }


    //Esta funcion vacia los arrays del objeto zonas_bas_salud y annade el codigo y el nombre de cada una de las zonas basicas de salud obtenidas de getZBS()
    let callbackZBS = function (response) {
        zonas_bas_salud_object.general.removeAll()
        zonas_bas_salud_object.hombre.removeAll()
        zonas_bas_salud_object.mujer.removeAll()
        zonas_bas_salud_object.edad_65_79.removeAll()
        zonas_bas_salud_object.edad_80.removeAll()
        zonas_bas_salud_object.perfil.removeAll()

        let ambito_array = (
            ambito() === "Andalucia" ? ambito_object.andalucia_zbs :
            ambito() === "Aragon" ? ambito_object.aragon_zbs :
            ambito() === "Principado de Asturias" ? ambito_object.asturias_zbs :
            ambito() === "Islas Baleares" ? ambito_object.baleares_zbs :
            ambito() === "Canarias" ? ambito_object.canarias_zbs :
            ambito() === "Cantabria" ? ambito_object.cantabria_zbs :
            ambito() === "Castilla-La Mancha" ? ambito_object.castillaLaMancha_zbs :
            ambito() === "Castilla y Leon" ? ambito_object.castillaLeon_zbs :
            ambito() === "Region de Murcia" ? ambito_object.murcia_zbs :
            ambito() === "Comunidad de Madrid" ? ambito_object.madrid_zbs :
            ambito() === "Cataluna" ? ambito_object.cataluña_zbs :
            ambito() === "Comunidad Valenciana" ? ambito_object.valencia_zbs :
            ambito() === "Pais Vasco" ? ambito_object.paisVasco_zbs :
            ambito() === "Galicia" ? ambito_object.galicia_zbs :
            ambito() === "Comunidad Foral de Navarra" ? ambito_object.navarra_zbs :
            ambito() === "Extremadura" ? ambito_object.extremadura_zbs :
            ambito() === "La Rioja" ? ambito_object.laRioja_zbs :
            ambito() === "España" ? Object.values(ambito_object).flat() : //si el ambito es españa coge todos los codigos del objeto en un solo array
            null
        );

        $.each(response, function (index, item) {
            if (ambito_array && ambito_array.includes(item.properties.codatzbs)) {
                addZBSG(item.properties.codatzbs, item.properties.n_zbs);
                addZBSH(item.properties.codatzbs, item.properties.n_zbs);
                addZBSM(item.properties.codatzbs, item.properties.n_zbs);
                addZBS_65_79(item.properties.codatzbs, item.properties.n_zbs);
                addZBS_80(item.properties.codatzbs, item.properties.n_zbs);
                addZBS_Perfil(item.properties.codatzbs, item.properties.n_zbs);
            }
        });
        //console.log('callback zonas', zonas_bas_salud())
        //setZBS(false)
    };

    //No se usa todavía
    var setZBS = function (s) {
        if (!s) {
            globalSector(undefined)
        }
        else {
            var t = ko.utils.arrayFirst(zonas_bas_salud(), function (f) {
                return f.codigo == s
            });

            if (t && (!globalSector() || s != globalSector().codigo)) {
                globalSector(t)
            }
        }
    };


    /**
     * Funcion push creada para que mute el array sobre el que actua y además introduzca en el los valores del array que recibe la funcion como parametro
     * 
     * @param {*} valuesToPushed 
     * @returns 
     */
    ko.observableArray.fn.pushAll = function (valuesToPushed) {
        var underlyingArray = this();
        this.valueWillMutate();
        this.removeAll();
        this.push(...valuesToPushed)
        this.valueHasMutated();
        return this;
    };

    /**
     * Función que añade los datos completos al objeto areas_sanitarias o zonas_bas_salud dependiendo del nivel de agregación y el tipo de variabilidad del dashboard.
     * 
     * Lo que se produce:
     *  {"codigo": "33","nombre": "Huesca","value": undefine} + {"codigo": "33","value": 3.2,"values": [...]} = {"codigo": "33","nombre": "Huesca","value": 3.2}
     * 
     * Cuando se han modificado todos los elementos del array de datos entonces en introducido en el array de areas sanitarias o zonas basicas de salud correspondiente.
     */
    function annadirValueSectores() {
        if (variabilidad_object.general == 'General') {
            if (globalAggLevel() === "as") {
                if ((areas_sanitarias_object.general().length == datos_object.datos_G.length)&& areas_sanitarias_object.general().length > 0) {

                    $.each(datos_object.datos_G, function (index, item) {
                        let area = areas_sanitarias_object.general().find(area => area.codigo == item.code_as)
                        item.codigo = area.codigo
                        item.nombre = area.nombre
                    })

                    areas_sanitarias_object.general.pushAll(datos_object.datos_G)
                    //console.log("areas_sanitarias_object_general : ", areas_sanitarias_object.general())
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.general().length == datos_object.datos_G.length) && zonas_bas_salud_object.general().length > 0) {

                    $.each(datos_object.datos_G, function (index, item) {
                        let zona = zonas_bas_salud_object.general().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.general.pushAll(datos_object.datos_G)
                }
            }
        }

        if (variabilidad_object.hombre == 'Hombre') {
            if (globalAggLevel() === "as") {
                if ((areas_sanitarias_object.hombre().length == datos_object.datos_H.length) && areas_sanitarias_object.hombre().length > 0) {

                    $.each(datos_object.datos_H, function (index, item) {
                        let area = areas_sanitarias_object.hombre().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre
                    })

                    areas_sanitarias_object.hombre.pushAll(datos_object.datos_H)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.hombre().length == datos_object.datos_H.length) && zonas_bas_salud_object.hombre().length > 0) {

                    $.each(datos_object.datos_H, function (index, item) {
                        let zona = zonas_bas_salud_object.hombre().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.hombre.pushAll(datos_object.datos_H)
                }
            }
        }

        if (variabilidad_object.mujer == 'Mujer') {
            if (globalAggLevel() === "as") {

                if ((areas_sanitarias_object.mujer().length == datos_object.datos_M.length) && areas_sanitarias_object.mujer().length > 0) {

                    $.each(datos_object.datos_M, function (index, item) {
                        let area = areas_sanitarias_object.mujer().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre

                    })

                    areas_sanitarias_object.mujer.pushAll(datos_object.datos_M)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.mujer().length == datos_object.datos_M.length) && zonas_bas_salud_object.mujer().length > 0) {

                    $.each(datos_object.datos_M, function (index, item) {
                        let zona = zonas_bas_salud_object.mujer().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.mujer.pushAll(datos_object.datos_M)
                }
            }
        }

        if (variabilidad_object.edad_65_79 == 'Edad_65_79') {
            if (globalAggLevel() === "as") {

                if ((areas_sanitarias_object.edad_65_79().length == datos_object.datos_65_79.length) && areas_sanitarias_object.edad_65_79().length > 0) {

                    $.each(datos_object.datos_65_79, function (index, item) {
                        let area = areas_sanitarias_object.edad_65_79().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre

                    })

                    areas_sanitarias_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.edad_65_79().length == datos_object.datos_65_79.length) && zonas_bas_salud_object.edad_65_79().length > 0) {

                    $.each(datos_object.datos_65_79, function (index, item) {
                        let zona = zonas_bas_salud_object.edad_65_79().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }
            }
        }

        if (variabilidad_object.edad_80 == 'Edad_80') {
            if (globalAggLevel() === "as") {

                if ((areas_sanitarias_object.edad_80().length == datos_object.datos_80.length) && areas_sanitarias_object.edad_80().length > 0) {

                    $.each(datos_object.datos_80, function (index, item) {
                        let area = areas_sanitarias_object.edad_80().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre

                    })

                    areas_sanitarias_object.edad_80.pushAll(datos_object.datos_80)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.edad_80().length == datos_object.datos_80.length) && zonas_bas_salud_object.edad_80().length > 0) {

                    $.each(datos_object.datos_80, function (index, item) {
                        let zona = zonas_bas_salud_object.edad_80().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.edad_80.pushAll(datos_object.datos_80)
                }
            }
        }

        if (variabilidad_object.perfil == 'Perfil') {
            if (globalAggLevel() === "as") {
                if ((areas_sanitarias_object.perfil().length == datos_object.datos_Perfil.length) && areas_sanitarias_object.perfil().length > 0) {

                    $.each(datos_object.datos_Perfil, function (index, item) {
                        let area = areas_sanitarias_object.perfil().find(area => area.codigo == item.codigo)
                        item.codigo = +area.codigo
                        item.nombre = area.nombre
                    })

                    areas_sanitarias_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }

            if (globalAggLevel() === "zbs") {
                if ((zonas_bas_salud_object.perfil().length == datos_object.datos_Perfil.length) && zonas_bas_salud_object.perfil().length > 0) {

                    $.each(datos_object.datos_Perfil, function (index, item) {
                        let zona = zonas_bas_salud_object.perfil().find(zona => zona.codigo == item.codigo)
                        item.codigo = +zona.codigo
                        item.nombre = zona.nombre
                    })

                    zonas_bas_salud_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }
        }
    }


    /*
        cada vez que se modifica el observable datos() entonces se ejecuta la funcion annadirValueSectores()
    */
    datos.subscribe(function () {

        annadirValueSectores()

    })


    /*
        Los siguientes computed observables se ejecutan devolviendo el array adecuado teniendo en cuenta el nivel de agregación y el tipo de variabilidad.
    */

    let getAreasZonasGeneral = ko.computed(function () {
        if ((areas_sanitarias_object.general().length == datos_object.datos_G.length) &&
            areas_sanitarias_object.general().length > 0 &&
            globalAggLevel() == 'as') {
            return areas_sanitarias_object.general()
        }
        if (//(zonas_bas_salud_object.general().length == datos_object.datos_G.length) &&
            zonas_bas_salud_object.general().length > 0 &&
            globalAggLevel() == 'zbs') {
                // console.log("areas_sanitarias_object: ", areas_sanitarias_object.general);
                console.log("zonas_basicas_salud_object.general: ", zonas_bas_salud_object.general() );
            return zonas_bas_salud_object.general
        }

    }, this)

    let getAreasZonasHombre = ko.computed(function () {

        if ((areas_sanitarias_object.hombre().length == datos_object.datos_H.length) &&
            areas_sanitarias_object.hombre().length > 0 &&
            globalAggLevel() == 'as') {
            //console.log(areas_sanitarias_object.hombre())
            //console.log(areas_sanitarias_object.hombre())

            return areas_sanitarias_object.hombre
        }

        if ((zonas_bas_salud_object.hombre().length == datos_object.datos_H.length) &&
            zonas_bas_salud_object.hombre().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.hombre
        }

    }, this)

    let getAreasZonasMujer = ko.computed(function () {

        if ((areas_sanitarias_object.mujer().length == datos_object.datos_M.length) &&
            areas_sanitarias_object.mujer().length > 0 &&
            globalAggLevel() == 'as') {
            //console.log(areas_sanitarias_object.mujer())
            return areas_sanitarias_object.mujer
        }

        if ((zonas_bas_salud_object.mujer().length == datos_object.datos_M.length) &&
            zonas_bas_salud_object.mujer().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.mujer
        }

    }, this)

    let getAreasZonasEdad_65_79 = ko.computed(function () {

        if ((areas_sanitarias_object.edad_65_79().length == datos_object.datos_65_79.length) &&
            areas_sanitarias_object.edad_65_79().length > 0 &&
            globalAggLevel() == 'as') {
            //console.log(areas_sanitarias_object.mujer())
            return areas_sanitarias_object.edad_65_79
        }

        if ((zonas_bas_salud_object.edad_65_79().length == datos_object.datos_65_79.length) &&
            zonas_bas_salud_object.edad_65_79().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.edad_65_79
        }

    }, this)

    let getAreasZonasEdad_80 = ko.computed(function () {

        if ((areas_sanitarias_object.edad_80().length == datos_object.datos_80.length) &&
            areas_sanitarias_object.edad_80().length > 0 &&
            globalAggLevel() == 'as') {
            //console.log(areas_sanitarias_object.mujer())
            return areas_sanitarias_object.edad_80
        }

        if ((zonas_bas_salud_object.edad_80().length == datos_object.datos_80.length) &&
            zonas_bas_salud_object.edad_80().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.edad_80
        }

    }, this)


    let getAreasZonasPerfil = ko.computed(function () {

        if ((areas_sanitarias_object.perfil().length == datos_object.datos_Perfil.length) &&
            areas_sanitarias_object.perfil().length > 0 &&
            globalAggLevel() == 'as') {

            return areas_sanitarias_object.perfil
        }

        if ((zonas_bas_salud_object.perfil().length == datos_object.datos_Perfil.length) &&
            zonas_bas_salud_object.perfil().length > 0 &&
            globalAggLevel() == 'zbs') {

            return zonas_bas_salud_object.perfil
        }

    }, this)


    /*
        Los codigos de los sectores seleccionados se eliminan cuando se cambia de nivel de agregación
    */
    globalAggLevel.subscribe(function () {
        //console.log("en subscribe aggLevel", globalAggLevel())
        selectedSectores.removeAll()
    })


    /**
     * Cuando el observable selectedSectores cambia se resetea el perfil del sector y se procede a realizar : getDataTabla(indicador, selectedSectores()).done(annadirPerfil)
     * Solo se ejecuta cuando el tipo de variabilidad es 'Perfil', es decir, para el dashboard de perfil de desempeño.
     */
    selectedSectores.subscribe(function () {
        perfil.removeAll()
        if (opcionesIndicadores().length > 0 && selectedSectores().length > 0 && variabilidad_object.perfil == 'Perfil') {

            //console.log('perfil', perfil())
            let datosIndicadores = opcionesIndicadores().find(element => element.escala == globalAggLevel()).indicadores[0].subindicadores

            //console.log('sectores seleccionados', selectedSectores())

            $.each(datosIndicadores, function (index, indicador) {
                //console.log(selectedSectores())
                getDataTabla(indicador, selectedSectores()).done(annadirPerfil)
            })

            //console.log('totalidad', datosIndicadores)
            //console.log('perfil', perfil())
        }
    })


    /**
     * Funcion que recibe los datos de la funcion getDataTabla() --> Esta funcion se encuentra en el javascript correpondiente al widget que muestra la tabla de perfil de desempeño.
     * 
     * El array que se introduce dentro del observable array perfil() tiene la siguiente estructura : 
     * [
            34.29, --> tasa estandarizada
            339772, --> Población
            1457, --> Nº de casos
            "Naranja", --> color de la bola
            "P", --> Tendencia
            32.93, --> P25
            "Cuenca", --> ZBS/Área
            "HPE por cualquier causa en mayores de 40 años", --> Indicador
            85 --> codigo de zbs o as
        ]
     * 
        Este array se usará para renderizar y crear la tabla de perfil de desempeño
     * @param {*} datos 
     */
    function annadirPerfil(datos) {
        const { idIndicador, nombreIndicador, data: dataPerfil } = datos;
        //console.log('indicador id', idIndicador)
        //console.log('perfil en cliente', dataPerfil)
        let perfilSector = []
        dataPerfil.data.forEach(element => {
            //console.log(element)
            let nombre = null;
            if (element.code_as) {
                nombre = datos_object.datos_Perfil.find(dato => dato.codigo == element.code_as).nombre;
            }
            if (element.code_zbs) {
                nombre = datos_object.datos_Perfil.find(dato => dato.codigo == element.code_zbs).nombre;
            }
            //console.log('nombre sector', nombre)
            element.values.push(nombre)
            element.values.push(nombreIndicador)
            element.values.push(idIndicador)
            perfilSector.push(element.values)
        });
        //console.log('perfilSector', perfilSector)
        perfil.push(perfilSector)
    }



    /**
     *  Esta funcion recibe el sector sobre el que se encuentra el raton en el mapa y busca sus datos en el array correspondiente
     * 
     *  @param {*} sector 
     */
    let updateSectorMapa = function (sector) {

        if (variabilidad_object.general == 'General') {

            if (globalAggLevel() === "as") {
                sector_seleccionado(areas_sanitarias_object.general().find(area => area.codigo == sector))
                return sector_seleccionado()
            }

            if (globalAggLevel() === "zbs") {
                sector_seleccionado(zonas_bas_salud_object.general().find(zona  => zona.codigo == sector))
                return sector_seleccionado()
            }
        }
        if (variabilidad_object.hombre == 'Hombre') {

            if (globalAggLevel() === "as") {
                sector_seleccionado(areas_sanitarias_object.hombre().find(area => area.codigo == sector))
                return sector_seleccionado()
            }

            if (globalAggLevel() === "zbs") {
                sector_seleccionado(zonas_bas_salud_object.hombre().find(zona  => zona.codigo == sector))
                return sector_seleccionado()
            }
        }
        if (variabilidad_object.mujer == 'Mujer') {

            if (globalAggLevel() === "as") {
                sector_seleccionado(areas_sanitarias_object.mujer().find(area => area.codigo == sector))
                return sector_seleccionado()
            }

            if (globalAggLevel() === "zbs") {
                sector_seleccionado(zonas_bas_salud_object.mujer().find(zona  => zona.codigo == sector))
                return sector_seleccionado()
            }
        }
        if (variabilidad_object.edad_65_79 == 'Edad_65_79') {

            if (globalAggLevel() === "as") {
                sector_seleccionado(areas_sanitarias_object.edad_65_79().find(area => area.codigo == sector))
                return sector_seleccionado()
            }

            if (globalAggLevel() === "zbs") {
                sector_seleccionado(zonas_bas_salud_object.edad_65_79().find(zona  => zona.codigo == sector))
                return sector_seleccionado()
            }
        }
        if (variabilidad_object.edad_80 == 'Edad_80') {

            if (globalAggLevel() === "as") {
                sector_seleccionado(areas_sanitarias_object.edad_80().find(area => area.codigo == sector))
                return sector_seleccionado()
            }

            if (globalAggLevel() === "zbs") {
                sector_seleccionado(zonas_bas_salud_object.edad_80().find(zona  => zona.codigo == sector))
                return sector_seleccionado()
            }
        }
        if (variabilidad_object.perfil == 'Perfil') {

            if (globalAggLevel() === "as") {
                sector_seleccionado(areas_sanitarias_object.perfil().find(area => area.codigo == sector))
                return sector_seleccionado()
            }

            if (globalAggLevel() === "zbs") {
                sector_seleccionado(zonas_bas_salud_object.perfil().find(zona  => zona.codigo == sector))
                return sector_seleccionado()
            }   
        }
    }

    //Cada vez que cambia sector_seleccionado se ejecuta la funcion para crear el grafico actualizado
    //Si el sector ya se encuentra dentro del array de sectores clickados no se envia para que no se repita en el grafico
    sector_seleccionado.subscribe(function () {

        if (datos_selected_sectores().includes(sector_seleccionado())) { 
            sector_seleccionado(null);
        }
        
        if (typeof obtenerDatosGrafico === "function") {
            obtenerDatosGrafico(sector_seleccionado(), datos_selected_sectores())
        }

    })

    //Cada vez que cambia datos_selected_sectores se ejecuta la funcion para crear el grafico actualizado
    //Si el sector ya se encuentra dentro del array de sectores clickados no se envia para que no se repita en el grafico
    datos_selected_sectores.subscribe(function () {

        if (datos_selected_sectores().includes(sector_seleccionado())) {
            sector_seleccionado(null);
        }

        if (typeof obtenerDatosGrafico === "function") {
            obtenerDatosGrafico(sector_seleccionado(), datos_selected_sectores())
        }

    })


    /**
     * Esta función realiza dos cosas:
     * 
     * Si el codigo del sector ya está en el array de selectedSectores eso significa que el sector ya estaba seleccionado, entonces se elimina ese codigo del array 
     * y se deja de destacar el sector en el mapa.
     * 
     * Si no estaba seleccionado entonces se destacan todos los sectores del mapa correspondientes a los codigos contenidos en el array sectoresSeleccionados
     *  y se añade el nuevo codigo al array
     * Además se envía a la parte superior de la tabla la fila correspondiente al sector que se acaba de seleccionar.
     */
    function seleccionSector(sectorId, sectoresSeleccionados) {
        if (selectedSectores().includes(sectorId)) {
            //console.log('Lo incluye')
            $.each(sectoresSeleccionados, function () {
                //console.log('sector', this)
                d3.select(this).style('stroke', "gray").style('stroke-width', '0.1')
            })
            let index = selectedSectores.indexOf(sectorId)
            selectedSectores.splice(index, 1)
            datos_selected_sectores.splice(index, 1)
        } else {
            //console.log(sectorSeleccionado)
            //console.log('No lo inluye')
            $.each(sectoresSeleccionados, function () {
                //console.log('sector', this)
                d3.select(this).style('stroke', "aqua").style('stroke-width', '2')
            })
            selectedSectores.push(sectorId)
            //console.log(selectedSectores());
            if (globalAggLevel() === "as") {
                if (variabilidad() == 'General') {
                    let sectorG = areas_sanitarias_object.general().find(sector => sector.codigo == sectorId)
                    let indexG = areas_sanitarias_object.general().indexOf(sectorG)
                    datos_selected_sectores.push(sectorG)
                    //console.log(datos_selected_sectores());
                    areas_sanitarias_object.general.splice(indexG, 1)
                    areas_sanitarias_object.general.unshift(sectorG)
                }
                if (variabilidad() == 'Hombre') {
                    let sectorH = areas_sanitarias_object.hombre().find(sector => sector.codigo == sectorId)
                    let indexH = areas_sanitarias_object.hombre().indexOf(sectorH)
                    datos_selected_sectores.push(sectorH)
                    areas_sanitarias_object.hombre.splice(indexH, 1)
                    areas_sanitarias_object.hombre.unshift(sectorH)
                }
                if (variabilidad() == 'Mujer') {
                    let sectorM = areas_sanitarias_object.mujer().find(sector => sector.codigo == sectorId)
                    let indexM = areas_sanitarias_object.mujer().indexOf(sectorM)
                    datos_selected_sectores.push(sectorM)
                    areas_sanitarias_object.mujer.splice(indexM, 1)
                    areas_sanitarias_object.mujer.unshift(sectorM)
                }
                if (variabilidad() == 'Edad_65_79') {
                    let sector65_79 = areas_sanitarias_object.edad_65_79().find(sector => sector.codigo == sectorId)
                    let index65_79 = areas_sanitarias_object.edad_65_79().indexOf(sector65_79)
                    datos_selected_sectores.push(sectorG)
                    areas_sanitarias_object.edad_65_79.splice(index65_79, 1)
                    areas_sanitarias_object.edad_65_79.unshift(sector65_79)
                }
                if (variabilidad() == 'Edad_80') {
                    let sector80 = areas_sanitarias_object.edad_80().find(sector => sector.codigo == sectorId)
                    let index80 = areas_sanitarias_object.edad_80().indexOf(sector80)
                    datos_selected_sectores.push(sector80)
                    areas_sanitarias_object.edad_80.splice(index80, 1)
                    areas_sanitarias_object.edad_80.unshift(sector80)
                }
                if (variabilidad() == 'Perfil') {
                    let sectorP = areas_sanitarias_object.perfil().find(sector => sector.codigo == sectorId)
                    let indexP = areas_sanitarias_object.perfil().indexOf(sectorP)
                    datos_selected_sectores.push(sectorP)
                    areas_sanitarias_object.perfil.splice(indexP, 1)
                    areas_sanitarias_object.perfil.unshift(sectorP)
                }
            }
            if (globalAggLevel() === "zbs") {
                if (variabilidad() == 'General') {
                    let sectorG = zonas_bas_salud_object.general().find(sector => sector.codigo == sectorId)
                    let indexG = zonas_bas_salud_object.general().indexOf(sectorG)
                    datos_selected_sectores.push(sectorG)
                    zonas_bas_salud_object.general.splice(indexG, 1)
                    zonas_bas_salud_object.general.unshift(sectorG)
                }
                if (variabilidad() == 'Hombre') {
                    let sectorH = zonas_bas_salud_object.hombre().find(sector => sector.codigo == sectorId)
                    let indexH = zonas_bas_salud_object.hombre().indexOf(sectorH)
                    datos_selected_sectores.push(sectorH)
                    zonas_bas_salud_object.hombre.splice(indexH, 1)
                    zonas_bas_salud_object.hombre.unshift(sectorH)
                }
                if (variabilidad() == 'Mujer') {
                    let sectorM = zonas_bas_salud_object.mujer().find(sector => sector.codigo == sectorId)
                    let indexM = zonas_bas_salud_object.mujer().indexOf(sectorM)
                    datos_selected_sectores.push(sectorM)
                    zonas_bas_salud_object.mujer.splice(indexM, 1)
                    zonas_bas_salud_object.mujer.unshift(sectorM)
                }
                if (variabilidad() == 'Edad_65_79') {
                    let sector65_79 = zonas_bas_salud_object.edad_65_79().find(sector => sector.codigo == sectorId)
                    let index65_79 = zonas_bas_salud_object.edad_65_79().indexOf(sector65_79)
                    datos_selected_sectores.push(sector65_79)
                    zonas_bas_salud_object.edad_65_79.splice(index65_79, 1)
                    zonas_bas_salud_object.edad_65_79.unshift(sector65_79)
                }
                if (variabilidad() == 'Edad_80') {
                    let sector80 = zonas_bas_salud_object.edad_80().find(sector => sector.codigo == sectorId)
                    let index80 = zonas_bas_salud_object.edad_80().indexOf(sector80)
                    datos_selected_sectores.push(sector80)
                    zonas_bas_salud_object.edad_80.splice(index80, 1)
                    zonas_bas_salud_object.edad_80.unshift(sector80)
                }
                if (variabilidad() == 'General') {
                    let sectorP = zonas_bas_salud_object.perfil().find(sector => sector.codigo == sectorId)
                    let indexP = zonas_bas_salud_object.perfil().indexOf(sectorP)
                    datos_selected_sectores.push(sectorP)
                    zonas_bas_salud_object.perfil.splice(indexP, 1)
                    zonas_bas_salud_object.perfil.unshift(sectorP)
                }
            }
        }
    }

    /**
     * Función que se ejecuta en el javascript que crea el Mapa.
     * 
     * Cuando se clicke en un sector en cualquiera de los mapas se seleccionarán los elementos path que tengan como clase el codigo de ese sector.
     * 
     * El codigo y los elementos se pasan como parámetros a la funcion seleccionSector()
     * @param {*} s 
     */
    let setSector = function (s) {
        //console.log("sector en biganStructure ", s)
        let sectoresSeleccionados = $(`.${s}`)
        //console.log('sectores seleccionados en click mapa', sectoresSeleccionados)
        seleccionSector(s, sectoresSeleccionados)
    }

    /**
     * Funcion que ordena las filas de la tabla de selección de forma alfabetica por el nombre del sector.
     * 
     * Se ejecuta cada vez que se clicke en el icono de la flecha.
     * 
     * @param {*} element 
     */
    function ordenarAlfabeticamente(element) {
        let id = $(element).attr('id')

        if (!$(element).hasClass('fa-arrow-circle-down')) {
            if (globalAggLevel() == 'as') {
                if (id == 'ordenarGeneral') {
                    datos_object.datos_G.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.general.pushAll(datos_object.datos_G)
                }

                if (id == 'ordenarHombre') {
                    datos_object.datos_H.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.hombre.pushAll(datos_object.datos_H)
                }

                if (id == 'ordenarMujer') {
                    datos_object.datos_M.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.mujer.pushAll(datos_object.datos_M)
                }

                if (id == 'ordenarEdad_65_79') {
                    datos_object.datos_65_79.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }

                if (id == 'ordenarEdad_80') {
                    datos_object.datos_80.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.edad_80.pushAll(datos_object.datos_80)
                }

                if (id == 'ordenarPerfil') {
                    datos_object.datos_Perfil.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    areas_sanitarias_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }

            if (globalAggLevel() == 'zbs') {
                if (id == 'ordenarGeneral') {
                    datos_object.datos_G.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.general.pushAll(datos_object.datos_G)
                }

                if (id == 'ordenarHombre') {
                    datos_object.datos_H.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.hombre.pushAll(datos_object.datos_H)
                }

                if (id == 'ordenarMujer') {
                    datos_object.datos_M.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.mujer.pushAll(datos_object.datos_M)
                }

                if (id == 'ordenarEdad_65_79') {
                    datos_object.datos_65_79.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }

                if (id == 'ordenarEdad_80') {
                    datos_object.datos_80.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.edad_80.pushAll(datos_object.datos_80)
                }

                if (id == 'ordenarPerfil') {
                    datos_object.datos_Perfil.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }
        }
        else {
            if (globalAggLevel() == 'as') {
                if (id == 'ordenarGeneral') {
                    datos_object.datos_G.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.general.pushAll(datos_object.datos_G)
                }

                if (id == 'ordenarHombre') {
                    datos_object.datos_H.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.hombre.pushAll(datos_object.datos_H)
                }

                if (id == 'ordenarMujer') {
                    datos_object.datos_M.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.mujer.pushAll(datos_object.datos_M)
                }

                if (id == 'ordenarEdad_65_79') {
                    datos_object.datos_65_79.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }

                if (id == 'ordenarEdad_80') {
                    datos_object.datos_80.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.edad_80.pushAll(datos_object.datos_80)
                }

                if (id == 'ordenarPerfil') {
                    datos_object.datos_Perfil.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    areas_sanitarias_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }

            if (globalAggLevel() == 'zbs') {
                if (id == 'ordenarGeneral') {
                    datos_object.datos_G.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.general.pushAll(datos_object.datos_G)
                }

                if (id == 'ordenarHombre') {
                    datos_object.datos_H.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.hombre.pushAll(datos_object.datos_H)
                }

                if (id == 'ordenarMujer') {
                    datos_object.datos_M.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.mujer.pushAll(datos_object.datos_M)
                }

                if (id == 'ordenarEdad_65_79') {
                    datos_object.datos_65_79.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.edad_65_79.pushAll(datos_object.datos_65_79)
                }

                if (id == 'ordenarEdad_80') {
                    datos_object.datos_80.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.edad_80.pushAll(datos_object.datos_80)
                }

                if (id == 'ordenarPerfil') {
                    datos_object.datos_Perfil.sort((a, b) => (a.nombre < b.nombre) ? 1 : ((b.nombre < a.nombre) ? -1 : 0))
                    zonas_bas_salud_object.perfil.pushAll(datos_object.datos_Perfil)
                }
            }
        }
    }

    /**
     * Custom binding localizado en el HTML correspondiente al widgte de tabla de perfil de desempeño.
     * 
     * En este binding se ejecuta la funcion leyendaTendencia() que se encuentra en el javascript correspondiente al widgte de tabla de perfil de desempeño.
     */
    ko.bindingHandlers.bindingTendencia = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            let value = ko.unwrap(valueAccessor());

            leyendaTendencia(element, value)

        }
    };

        /**
     * Custom binding localizado en el HTML correspondiente al widgte de tabla de perfil de desempeño.
     * 
     * En este binding se ejecuta la funcion leyendaTendencia() que se encuentra en el javascript correspondiente al widgte de tabla de perfil de desempeño.
     */
    ko.bindingHandlers.bindingPerfilDesempenno = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            let values = ko.unwrap(valueAccessor());

            //const {color, id, P25} = value;
            //console.log('hsa')
            getLeyendaPerfilDesempenno(element, values).done(leyendaPerfilDesempenno)

        }
    }


    var init = function () {

        /**
         * Al final de los callback se ejecuta la función annadirValueSectores() para que se muestren los datos por defecto al cargar la página
         */
        Promise.all([getZBS(), getAS()]).then(values => {
            callbackZBS(values[0])
            callbackAS(values[1])
            annadirValueSectores()
        })


        /**
         * Se aplican los binding del modelo
         */
        $(".str-bindable").each(function () {

            ko.applyBindings(myViewModel, this)
        })

        /**
         * Cuando se clicke el icono de la flecha se ejecuta la funcion ordenarAlfabeticamente() y se modifica la orientación de la flecha.
         */
        $(this).on('click', 'i[title="Ordenar alfabéticamente"]', function () {
            ordenarAlfabeticamente(this)
            $(this).toggleClass('fa-arrow-circle-up fa-arrow-circle-down')
        })

        /**
         * Cuando se clicke en una de las líneas de la tabla significa que se ha seleccionado ese sector entonces se identifica el id del sector y los elementos del mapa que corresponden a ese id
         * Se pasan como parametros a la funcion seleccionSector().
         */
        $(this).on('click', '#table-item', function () {
            let idSector = $(this).find('span').text()
            let sectoresSeleccionados = $(`.${idSector}`)
            //console.log('sectores seleccionados', sectoresSeleccionados)
            seleccionSector(idSector, sectoresSeleccionados)
        })

        /**
         * Cuando se clicka el icono de la x roja entonces se dejan de destacar los sectores del mapa y las filas de la tabla.
         */
        $(this).on('click', '#Limpiar', function () {
            selectedSectores.removeAll()
            let sectores = $('path')
            $.each(sectores, function (index, sector) {
                d3.select(sector).style('stroke', "gray").style('stroke-width', '0.1')
            })
        })

        //obtiene el label del mapa para establecer la variabilidad del dashboard
        var container = document.getElementById('map');

        var label = 'General';
        if (container) {
            label = container.getAttribute('data-label');
        }

        setVariabilidad(label);
    };

    $(init);


    return {
        aggLevels: aggLevels,
        globalAggLevel: globalAggLevel,
        setAggLevel: setAggLevel,
        getAggLevel: getAggLevel,
        indicadores: indicadores,
        setIndicador: setIndicador,
        globalIndicador: globalIndicador,
        getIndicador: getIndicador,
        setDataAggLevels: setDataAggLevels,
        setDataIndicadores: setDataIndicadores,
        opcionesIndicadores: opcionesIndicadores,
        elegirIndicadores: elegirIndicadores,
        setSector: setSector,
        updateSectorMapa : updateSectorMapa,
        selectedSectores: selectedSectores,
        getAreasZonasGeneral: getAreasZonasGeneral,
        getAreasZonasHombre: getAreasZonasHombre,
        getAreasZonasMujer: getAreasZonasMujer,
        getAreasZonasEdad_65_79: getAreasZonasEdad_65_79,
        getAreasZonasEdad_80: getAreasZonasEdad_80,
        getAreasZonasPerfil: getAreasZonasPerfil,
        setVariabilidad,
        setData,
        perfil: perfil
    }
}();