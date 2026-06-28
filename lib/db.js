/* ==========================================================================
   BONSAI HỘI QUÁN - MOCK DATABASE LAYER (VI, EN, JP DATA DICTIONARY)
   ========================================================================== */

export const DEFAULT_ARTISANS = {
    "nguyen_van_ba": {
        id: "nguyen_van_ba",
        name: "Nguyễn Văn Ba",
        nickname: {
            vi: "Ba Sanh Nam Định",
            en: "Ba Sanh Nam Dinh",
            jp: "ナムディンのバー・サニ"
        },
        rank: {
            vi: "Nghệ nhân ưu tú Cấp Quốc Gia",
            en: "National Elite Artisan",
            jp: "国家優秀職人"
        },
        address: {
            vi: "Hải Hậu, Nam Định",
            en: "Hai Hau, Nam Dinh",
            jp: "ナムディン省ハイハウ"
        },
        bio: {
            vi: "Với hơn 35 năm kinh nghiệm uốn nắn dòng Sanh Nam Điền cổ. Vườn cây rộng 2000m² sở hữu hơn 150 tác phẩm cỡ đại có giá trị nghệ thuật cao, đạt nhiều huy chương vàng tại các triển lãm sinh vật cảnh toàn quốc.",
            en: "Over 35 years of experience styling ancient Nam Dien Ficus. The 2000m² garden owns over 150 large-sized high-value masterpieces, winning multiple gold medals at national exhibitions.",
            jp: "古木ナムディン・サニ（フィカス）の仕立てに35年以上の経験を持つ。2000㎡の庭園には150点以上の大型名作盆栽があり、全国展示会で多数の金賞を受賞している。"
        },
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1000&fit=crop&q=80",
        phone: "0912.345.678",
        zalo: "https://zalo.me/0912345678",
        featuredOverride: false,
        guestbook: [
            { 
                name: "Lâm Bonsai", 
                contact: "0988xxxxxx", 
                content: "Vườn bác Ba nhiều phôi Sanh chất lượng quá, cành giật rất chi tiết!", 
                date: "02/06/2026" 
            },
            { 
                name: "Trần Minh", 
                contact: "Visitor", 
                content: "Đã ghé thăm vườn bác Ba một lần, rất choáng ngợp trước quy mô vườn.", 
                date: "28/05/2026" 
            }
        ],
        blog: [
            { 
                date: "Tháng 5/2026", 
                title: {
                    vi: "Xả lá tạo tán đợt đầu mùa mưa cho dàn Sanh cổ",
                    en: "Defoliating ancient Ficus trees at early rainy season",
                    jp: "雨季初期におけるサニ古木の葉刈りと枝付け"
                }, 
                content: {
                    vi: "Đợt mưa dông đầu hè là thời điểm vàng để xả toàn bộ lá Sanh, giúp phơi bày bộ xương cành để sửa lại các chi tiết nhỏ bị lỡ hướng.",
                    en: "Early summer rainstorms are the golden time to strip all Ficus leaves, exposing the branch skeleton to correct minor alignment details.",
                    jp: "初夏の嵐の時期は葉刈りの最適期であり、枝の骨格を露出させて細部を修正することができます。"
                }, 
                media: "https://images.unsplash.com/photo-1551075649-8fdfd4c6f842?w=600&fit=crop&q=80" 
            },
            { 
                date: "Tháng 2/2026", 
                title: {
                    vi: "Khai xuân đón chậu đá cổ cho cây 'Độc Long'",
                    en: "Welcoming ancient stone pot for 'Doc Long' tree in spring",
                    jp: "春、「ドック・ロン」にアンティークの石鉢を迎える"
                }, 
                content: {
                    vi: "Mới sưu tầm được chiếc chậu đá ghép nguyên khối từ thời Nguyễn, vừa khít để đưa cây Sanh dáng Long ôm đá vào.",
                    en: "Just collected a solid carved stone pot from the Nguyen Dynasty, a perfect fit for the Dragon-style Ficus embracing rock.",
                    jp: "グエン朝時代の無垢の石鉢を入手し、石付きの昇竜型サniを植え替えました。"
                }, 
                media: "https://images.unsplash.com/photo-1599598177991-ec67b5c37318?w=600&fit=crop&q=80" 
            }
        ]
    },
    "tran_lam": {
        id: "tran_lam",
        name: "Trần Lâm",
        nickname: {
            vi: "Lâm Bonsai Miền Tây",
            en: "Lam Western Bonsai",
            jp: "メコンデルタのラム・盆栽"
        },
        rank: {
            vi: "Nghệ nhân cấp Tỉnh",
            en: "Provincial Artisan",
            jp: "地方優秀職人"
        },
        address: {
            vi: "Chợ Lách, Vĩnh Long",
            en: "Cho Lach, Vinh Long",
            jp: "ビンロン省チョーラック"
        },
        bio: {
            vi: "Chuyên sâu về dòng Bonsai Mini và Bonsai Trung nghệ thuật như Mai Chiếu Thủy, Linh Sam sông Hinh, Sam Hương. Phong cách phóng khoáng, uốn nắn theo dáng cây tự nhiên thiên nhiên.",
            en: "Specializing in artistic Mini and Medium Bonsai such as Wrightia religiosa, Desmodium, Premna microphylla. Free style, training following natural tree structures.",
            jp: "水梅（スイバイ）、ベトナム松、サミャンなどのミニ・中型盆栽を専門とする。自然界の樹木に倣った、のびのびとした作風が特徴。"
        },
        avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=250&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1000&fit=crop&q=80",
        phone: "0988.765.432",
        zalo: "https://zalo.me/0988765432",
        featuredOverride: false,
        guestbook: [
            { 
                name: "Hoàng Tùng", 
                contact: "Nghệ nhân", 
                content: "Cây Linh Sam lũa thép của chú Lâm uốn theo phong cách Nhật Bản rất chuẩn chỉ.", 
                date: "01/06/2026" 
            }
        ],
        blog: [
            { 
                date: "Tháng 4/2026", 
                title: {
                    vi: "Làm lũa cho cây Linh Sam dáng Thác Đổ",
                    en: "Creating jin/shari for Cascade Desmodium",
                    jp: "懸崖型ベトナム松の神（ジン）作り"
                }, 
                content: {
                    vi: "Sử dụng máy mài kết hợp đục tay để tạo phần lũa zin dọc thân cây. Lũa Linh Sam sông Hinh cứng như thép, càng nắng mưa càng lên màu đẹp.",
                    en: "Using grinder and hand chisels to create natural deadwood along the trunk. Desmodium wood is hard as steel, weathering beautifully.",
                    jp: "グラインダーと手彫りで幹に沿って自然なシャリ（削り）を入れます。この木は非常に堅く、雨風にさらされるほど美しい色合いになります。"
                }, 
                media: "https://images.unsplash.com/photo-1627347902083-edbcaa5c4286?w=600&fit=crop&q=80" 
            }
        ]
    },
    "le_hoang": {
        id: "le_hoang",
        name: "Lê Hoàng",
        nickname: {
            vi: "Hoàng Tùng Bình Định",
            en: "Hoang Tung Binh Dinh",
            jp: "ビンディン省のホアン・ツン"
        },
        rank: {
            vi: "Nghệ nhân cấp Tỉnh",
            en: "Provincial Artisan",
            jp: "地方優秀職人"
        },
        address: {
            vi: "An Nhơn, Bình Định",
            en: "An Nhon, Binh Dinh",
            jp: "ビンディン省アンニョン"
        },
        bio: {
            vi: "Đam mê tạo dáng Tùng La Hán và Phi Lao ôm đá phong ba bão táp. Thiết kế vườn theo phong cách Thiền viện Nhật Bản pha lẫn truyền thống Việt Nam.",
            en: "Passionate about styling Buddhist Pine and Casuarina embracing storm-beaten rocks. Garden design blends Japanese Zen style with Vietnamese traditions.",
            jp: "羅漢松や石付きのイソマツ（黒松風）の仕立てに情熱を注ぐ。庭園は和の禅スタイルとベトナムの伝統を融合させた設計。"
        },
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1510253687831-0f982d7862fc?w=1000&fit=crop&q=80",
        phone: "0905.999.888",
        zalo: "https://zalo.me/0905999888",
        featuredOverride: false,
        guestbook: [],
        blog: [
            { 
                date: "Tháng 3/2026", 
                title: {
                    vi: "Đưa Tùng La Hán dáng Bạt Phong lên khay mỏng",
                    en: "Moving Windswept Buddhist Pine into shallow tray",
                    jp: "吹き流し型羅漢松を極薄盆器へ植え替え"
                }, 
                content: {
                    vi: "Cây Tùng nuôi 18 năm nay mới đủ lực rễ để cắt bỏ rễ cọc, chuyển sang khay đất nung siêu mỏng dáng bay phóng khoáng.",
                    en: "This Pine has been cultivated for 18 years, finally having enough root strength to prune the taproot and transfer to a super shallow clay container.",
                    jp: "18年間育てられた松。直根を落とせるほど根が十分に充実したため、極浅の泥鉢に植え替えて躍動感を表現しました。"
                }, 
                media: "https://images.unsplash.com/photo-1648410775702-b201a9f15c20?w=600&fit=crop&q=80" 
            }
        ]
    }
};

export const DEFAULT_TREES = [
    {
        id: "tree_01",
        title: {
            vi: "Sanh Nam Điền 'Hồn Việt' cổ thụ",
            en: "Ancient Nam Dien Ficus 'Soul of Vietnam'",
            jp: "古木ナムディン・サニ「ベトナムの魂」"
        },
        species: {
            vi: "Sanh Nam Điền",
            en: "Nam Dien Ficus",
            jp: "ナムディン産サニ（フィカス）"
        },
        style: "Trực Lắc",
        size: "Đại",
        age: {
            vi: "~40 năm tạo tác",
            en: "~40 years of training",
            jp: "仕立て歴約40年"
        },
        potAge: {
            vi: "20 năm thuần chậu",
            en: "20 years in pot",
            jp: "鉢植え歴20年"
        },
        origin: {
            vi: "Nam Định",
            en: "Nam Dinh Province",
            jp: "ナムディン省"
        },
        status: "Trưng bày",
        price: 0,
        story: {
            vi: "Tác phẩm đắc ý nhất vườn, được nghệ nhân Ba Nam Định bứng phôi uốn nắn từ thời trẻ. Thân cây u bướu, nu cuồn cuộn nổi rõ dấu vết thời gian phong sương. Bộ bệ rễ chảy tràn vững chãi như chân cột đình làng.",
            en: "The most favored masterpiece of the garden, styled by artisan Ba since his youth. The trunk is heavily knobby with rolls of bark showcasing weathered trace of time. The massive root flare spreads out solid like pillars of a traditional communal house.",
            jp: "庭園一番のお気に入り。職人バーが若かりし頃から仕立ててきた名作。幹はゴツゴツと隆起し、歳月の風雪を物語っています。四方に力強く張った盤根は、村の古い集会所の柱のように頑強です。"
        },
        images: [
            "https://images.unsplash.com/photo-1599598177991-ec67b5c37318?w=800&q=80",
            "https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=800&q=80",
            "https://images.unsplash.com/photo-1561641250-c06551cf3b02?w=800&q=80"
        ],
        ownerId: "nguyen_van_ba",
        approved: true,
        evolution: [
            { 
                year: "2008", 
                desc: {
                    vi: "Bứng cây phôi từ vườn đất bùn, bắt đầu lên chậu tròn nuôi bệ rễ chảy tràn.",
                    en: "Collected the raw stump from muddy garden, potted in circular tray to grow root flare.",
                    jp: "泥地から素材を掘り出し、根張りを育てるため丸鉢に植え替え。"
                } 
            },
            { 
                year: "2015", 
                desc: {
                    vi: "Cắt giật tay cành lần 2, bắt đầu định hình dăm xương và bông tán.",
                    en: "Second structural pruning of main branches, began styling branch skeleton and foliage pads.",
                    jp: "二次枝の切り戻しを行い、小枝と棚の輪郭形成を開始。"
                } 
            },
            { 
                year: "2026", 
                desc: {
                    vi: "Tác phẩm hoàn thiện dăm, lá thu nhỏ bóng bẩy, lên chậu đá cổ đạt độ chín nghệ thuật.",
                    en: "The foliage is fully refined, leaves are small and glossy, matching the ancient stone pot in its golden peak.",
                    jp: "細枝まで完成。葉は極小に引き締まり艶があり、アンティークの石鉢と調和した最高の状態。"
                } 
            }
        ]
    },
    {
        id: "tree_02",
        title: {
            vi: "Si cổ 'Thác Đổ Mây Ngàn'",
            en: "Ancient Ficus 'Cascade in the Clouds'",
            jp: "古木ガジュマル「雲海の懸崖」"
        },
        species: {
            vi: "Si búp đỏ",
            en: "Red Ficus microcarpa",
            jp: "赤葉ガジュマル"
        },
        style: "Huyền / Thác Đổ",
        size: "Trung",
        age: {
            vi: "~25 năm",
            en: "~25 years",
            jp: "樹齢約25年"
        },
        potAge: {
            vi: "12 năm thuần chậu",
            en: "12 years in pot",
            jp: "鉢植え歴12年"
        },
        origin: {
            vi: "Hà Tây cũ",
            en: "Ha Tay Province",
            jp: "旧ハタイ省"
        },
        status: "Đang giao lưu",
        price: 85000000,
        story: {
            vi: "Cây Si dáng thác đổ mềm mại bò dọc sườn chậu ống. Tay cành bông tán xếp lớp như những đám mây lượn bao phủ sườn núi. Lá Si búp đỏ dày bóng rất bắt mắt.",
            en: "A red Ficus cascaded gracefully down the side of a tall cylinder pot. Foliage pads are styled in layered clouds covering a mountain ridge. Glossy thick leaves show wonderful vitality.",
            jp: "深鉢の縁からしなやかに垂れ下がるガジュマル。枝葉は山肌を覆う層状の雲のように配置されています。肉厚で光沢のある葉が目を引きます。"
        },
        images: [
            "https://images.unsplash.com/photo-1641412722397-3be359096577?w=800&q=80",
            "https://images.unsplash.com/photo-1569873175476-10aa45523ab8?w=800&q=80"
        ],
        ownerId: "nguyen_van_ba",
        approved: true,
        evolution: [
            { 
                year: "2014", 
                desc: {
                    vi: "Bắt đầu quấn dây định hướng thân đổ đổ dốc xuống sườn chậu.",
                    en: "Began wiring to train the main trunk cascading down the container side.",
                    jp: "針金をかけ、幹が鉢の側面を急降下するよう下向きに誘導。"
                } 
            },
            { 
                year: "2020", 
                desc: {
                    vi: "Nuôi cành phóng làm đối trọng cân bằng thế cây thác đổ.",
                    en: "Developed the counter-weight branch to balance the cascade structure.",
                    jp: "懸崖全体のバランスを取るため、反対側に受け枝を育成。"
                } 
            },
            { 
                year: "2026", 
                desc: {
                    vi: "Bông tán thu gọn gàng tròn trịa như các đĩa mây rêu.",
                    en: "Foliage pads compact and neat like round moss clouds.",
                    jp: "棚がコンパクトに整い、まるで緑の雲のような美しさに。"
                } 
            }
        ]
    },
    {
        id: "tree_03",
        title: {
            vi: "Linh Sam sông Hinh 'Lũa Thép'",
            en: "Desmodium 'Steel Deadwood'",
            jp: "ベトナム松「鉄色のジン」"
        },
        species: {
            vi: "Linh Sam sông Hinh",
            en: "Song Hinh Desmodium",
            jp: "ベトナム松（リンサム）"
        },
        style: "Huyền / Thác Đổ",
        size: "Mini",
        age: {
            vi: "~18 năm",
            en: "~18 years",
            jp: "樹齢約18年"
        },
        potAge: {
            vi: "8 năm",
            en: "8 years",
            jp: "鉢植え歴8年"
        },
        origin: {
            vi: "Phú Yên",
            en: "Phu Yen Province",
            jp: "フーイエン省"
        },
        status: "Đang giao lưu",
        price: 32000000,
        story: {
            vi: "Tác phẩm Linh Sam cỡ nhỏ có phần lũa zin chạy dọc thân đen bóng cứng cáp. Thân đổ uốn éo nghệ thuật, hoa màu tím biếc thơm dịu khi mùa mưa tới.",
            en: "A small-sized Desmodium featuring natural steel-colored shari running along a robust trunk. Artistic twisted shape, blooming with fragrant purple flowers.",
            jp: "小ぶりの作品ながら、幹に沿って鉄色をした頑強な自然の舎利（シャリ）が走っています。芸術的にねじれた幹から、雨期になると紫色の甘い香りの花が咲きます。"
        },
        images: [
            "https://images.unsplash.com/photo-1627347902083-edbcaa5c4286?w=800&q=80",
            "https://images.unsplash.com/photo-1526397751294-331021109fbd?w=800&q=80"
        ],
        ownerId: "tran_lam",
        approved: true,
        evolution: [
            { 
                year: "2018", 
                desc: {
                    vi: "Cây bị lũa tự nhiên một phần thân, bắt đầu xử lý thuốc bảo quản lũa và uốn cành bay.",
                    en: "Natural decay started on part of trunk, applied lime sulfur preservative and wired the cascading branch.",
                    jp: "幹の一部が自然に舎利化したため保護剤を塗布し、枝先の流れを整形。"
                } 
            },
            { 
                year: "2026", 
                desc: {
                    vi: "Chi dăm dày đặc, tán lá mọc ôm sát thân lũa.",
                    en: "Dense ramifications, foliage closely hugs the sculpted deadwood.",
                    jp: "枝先が非常に細かくほぐれ、舎利に這うように葉が密集。"
                } 
            }
        ]
    },
    {
        id: "tree_04",
        title: {
            vi: "Mai Chiếu Thủy 'Nghinh Phong'",
            en: "Wrightia religiosa 'Facing the Wind'",
            jp: "水梅「吹き流し（迎風）」"
        },
        species: {
            vi: "Mai Chiếu Thủy lá trung",
            en: "Medium-leaf Wrightia",
            jp: "中葉水梅（スイバイ）"
        },
        style: "Bạt Phong",
        size: "Trung",
        age: {
            vi: "~30 năm",
            en: "~30 years",
            jp: "樹齢約30年"
        },
        potAge: {
            vi: "15 năm",
            en: "15 years",
            jp: "鉢植え歴15年"
        },
        origin: {
            vi: "Bến Tre",
            en: "Ben Tre Province",
            jp: "ベンチェ省"
        },
        status: "Trưng bày",
        price: 0,
        story: {
            vi: "Thế cây bạt phong thể hiện tinh thần kiên cường chống chọi gió bão. Tất cả cành dăm đều vuốt xiêu về một hướng như gió thổi mạnh từ mạn sườn. Cây ra hoa trắng trĩu cành rủ xuống đất thơm mát vườn.",
            en: "Windswept style showcasing resilient spirit against storm. All twigs are trained flowing in one direction. Heavily blooms with hanging white fragrant star flowers.",
            jp: "嵐に耐え忍ぶ不屈の精神を表す吹き流し。すべての小枝は、一方向から強風を受けたかのように流されています。白く垂れ下がる無数の小さな花が甘い香りを放ちます。"
        },
        images: [
            "https://images.unsplash.com/photo-1467043198406-dc953a3defa0?w=800&q=80",
            "https://images.unsplash.com/photo-1632161286719-5afe9b5d954b?w=800&q=80"
        ],
        ownerId: "tran_lam",
        approved: true,
        evolution: [
            { 
                year: "2012", 
                desc: {
                    vi: "Mua phôi dáng trực nhưng bị khuyết tán một bên, quyết định cắt giật uốn sang thế bạt phong lùa gió.",
                    en: "Purchased as upright stump but missing one side branches, chose to recut and train as windswept style.",
                    jp: "元は直幹の素材だったが片側の枝がなかったため、切り戻して吹き流し型へ改作。"
                } 
            },
            { 
                year: "2026", 
                desc: {
                    vi: "Tán dăm đạt độ mịn tuyệt đối, hoa nở đồng loạt tạo thành bức tranh sơn thủy.",
                    en: "Branch structure reached extreme density, synchronous blooming creates a dynamic landscape painting.",
                    jp: "枝配りが極限まで完成し、一斉に開花する姿はまるで山水画のよう。"
                } 
            }
        ]
    },
    {
        id: "tree_05",
        title: {
            vi: "Tùng La Hán 'Độc Bản Nghinh Khách'",
            en: "Buddhist Pine 'Welcome Guest'",
            jp: "羅漢松「一品迎客」"
        },
        species: {
            vi: "Tùng La Hán",
            en: "Buddhist Pine",
            jp: "羅漢松（ラカンショウ）"
        },
        style: "Trực",
        size: "Đại",
        age: {
            vi: "50 năm",
            en: "50 years",
            jp: "樹齢約50年"
        },
        potAge: {
            vi: "22 năm",
            en: "22 years",
            jp: "鉢植え歴22年"
        },
        origin: {
            vi: "Bình Định",
            en: "Binh Dinh Province",
            jp: "ビンディン省"
        },
        status: "Trưng bày",
        price: 0,
        story: {
            vi: "Cây tùng dáng trực oai phong lẫm liệt, một cành vươn ngang dài chìa đón khách tham quan vườn. Dòng tùng La Hán kim xanh bóng khỏe quanh năm, cốt cành cực kỳ to khỏe.",
            en: "Majestic formal upright Pine, featuring a long horizontal welcoming branch extending to greet garden visitors. Dark green needle foliage, extremely stout branch structures.",
            jp: "威風堂々とした直幹の松。1本の長い大枝が横に伸び、あたかも来訪者を温かく出迎えているかのようです。針葉は一年中濃緑に輝き、枝骨は非常に太く頑強です。"
        },
        images: [
            "https://images.unsplash.com/photo-1683491175728-5921087a95ac?w=800&q=80",
            "https://images.unsplash.com/photo-1648410775702-b201a9f15c20?w=800&q=80"
        ],
        ownerId: "le_hoang",
        approved: true,
        evolution: [
            { 
                year: "1998", 
                desc: {
                    vi: "Được chiết cành từ cây mẹ cổ thụ, nuôi ròng rã đất vườn Bình Định.",
                    en: "Propagated via air layering from mother tree, raised in open ground of Binh Dinh garden.",
                    jp: "古い親木から高取りして発根させ、ビンディン省の畑地で長年養成。"
                } 
            },
            { 
                year: "2010", 
                desc: {
                    vi: "Bứng đưa lên chậu lục giác lớn, bắt đầu ép tán tùng mỏng hình đĩa xòe.",
                    en: "Lifted into large hexagonal pot, started thinning and shaping the thin disk-like foliage plates.",
                    jp: "大型の六角鉢に上げ、棚状の薄い輪郭を形成し始める。"
                } 
            },
            { 
                year: "2026", 
                desc: {
                    vi: "Cây đạt chiều cao 1m8, dáng hiên ngang đón gió biển miền Trung.",
                    en: "Reaches 1.8 meters tall, standing tall facing coastal winds of central Vietnam.",
                    jp: "樹高1.8メートルに達し、ベトナム中部の潮風に耐え凛と立つ。"
                } 
            }
        ]
    }
];

// Helper functions that run dynamically on the client side
export function getDbState() {
    if (typeof window === "undefined") {
        return { artisans: DEFAULT_ARTISANS, trees: DEFAULT_TREES, moderationRequired: false };
    }
    const artisans = localStorage.getItem("bh_artisans") ? JSON.parse(localStorage.getItem("bh_artisans")) : DEFAULT_ARTISANS;
    const trees = localStorage.getItem("bh_trees") ? JSON.parse(localStorage.getItem("bh_trees")) : DEFAULT_TREES;
    const moderationRequired = localStorage.getItem("bh_moderation_required") ? JSON.parse(localStorage.getItem("bh_moderation_required")) : false;
    
    // Save defaults back if not set
    if (!localStorage.getItem("bh_artisans")) localStorage.setItem("bh_artisans", JSON.stringify(DEFAULT_ARTISANS));
    if (!localStorage.getItem("bh_trees")) localStorage.setItem("bh_trees", JSON.stringify(DEFAULT_TREES));
    if (!localStorage.getItem("bh_moderation_required")) localStorage.setItem("bh_moderation_required", JSON.stringify(false));
    
    return { artisans, trees, moderationRequired };
}

export function saveDbState(state) {
    if (typeof window === "undefined") return;
    localStorage.setItem("bh_artisans", JSON.stringify(state.artisans));
    localStorage.setItem("bh_trees", JSON.stringify(state.trees));
    localStorage.setItem("bh_moderation_required", JSON.stringify(state.moderationRequired));
}
