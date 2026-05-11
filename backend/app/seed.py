"""Seed database with realistic synthetic data."""
from datetime import datetime, timedelta, timezone

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.tender import Tender, TenderBid, TenderStatus, BidStatus
from app.models.portfolio import PortfolioItem
from app.models.category import Category
from app.services.auth import hash_password

PASSWORD = hash_password("demo123")

U = "https://images.unsplash.com"

# Verified Unsplash photo IDs — each URL checked with HEAD request 2026-05-11
IMG = {
    # ── Brewery / Beer ──
    "brewery_tanks": f"{U}/photo-1545287072-469f3761413c?w=600&h=400&fit=crop",      # gray stainless brewery tank
    "brewery_craft": f"{U}/photo-1651475828382-1ffeea47739b?w=600&h=400&fit=crop",    # large brewery industrial machine
    # ── Distillation / Copper ──
    "copper_stills": f"{U}/photo-1765989506097-e8f1a3e03844?w=600&h=400&fit=crop",    # copper stills in distillery hall
    # ── CNC / Metalwork ──
    "cnc_machine": f"{U}/photo-1652888510609-ed2d2ad64d6b?w=600&h=400&fit=crop",      # CNC machine cutting on table
    "metal_sparks": f"{U}/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop",     # metalwork grinding sparks
    # ── Welding ──
    "welding": f"{U}/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop",         # welding sparks closeup
    # ── Woodworking ──
    "wood_lathe": f"{U}/photo-1611021061285-16c871740efa?w=600&h=400&fit=crop",       # person turning on wood lathe
    "workbench": f"{U}/photo-1674562266463-640ee94e3e0e?w=600&h=400&fit=crop",        # close-up woodworking on machine
    "woodshop": f"{U}/photo-1416339698674-4f118dd3388b?w=600&h=400&fit=crop",         # woodworking shop
    # ── Pottery / Ceramics ──
    "pottery_wheel": f"{U}/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop",    # hands on pottery wheel
    "kiln_ceramics": f"{U}/photo-1562259929-b4e1fd3aef09?w=600&h=400&fit=crop",       # ceramic pots / kiln results
    # ── Glass ──
    "glassblowing": f"{U}/photo-1767725185080-5e8bffbfaee9?w=600&h=400&fit=crop",     # glassblower with molten glass
    "glass_work": f"{U}/photo-1773125465958-4b83adc60498?w=600&h=400&fit=crop",       # glassblower holds molten glass
    # ── Textile / Weaving ──
    "weaving_loom": f"{U}/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop",        # colorful threads on loom
    # ── Industrial / Filtration ──
    "industrial_pipes": f"{U}/photo-1538474705339-e87de81450e8?w=600&h=400&fit=crop",  # metal pipes grayscale
    "ventilation": f"{U}/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",       # ventilation duct system
    # ── Wrought Iron ──
    "iron_gate": f"{U}/photo-1585580956413-5a952a885159?w=600&h=400&fit=crop",        # wrought iron fence
    # ── Laser Cutting ──
    "laser_cut": f"{U}/photo-1558346490-a72e53ae2d4f?w=600&h=400&fit=crop",           # laser cutting metal sparks
    # ── Food / Smoking ──
    "smoked_meat": f"{U}/photo-1544025162-d76694265947?w=600&h=400&fit=crop",         # BBQ meat smoking
    "olive_oil": f"{U}/photo-1515706886582-54c73c5eaf41?w=600&h=400&fit=crop",        # olive oil production
    # ── Packaging ──
    "tea_packaging": f"{U}/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop",       # tea bags / packaging
    # ── Winding / Coils ──
    "coils_wire": f"{U}/photo-1565377167263-d29b5ac85479?w=600&h=400&fit=crop",       # mechanical engine with coils
}

# Category images
CAT_IMG = {
    "metalwork": IMG["metal_sparks"],
    "woodwork": IMG["woodshop"],
    "food-equipment": IMG["brewery_tanks"],
    "glass-ceramics": IMG["pottery_wheel"],
    "textile": IMG["weaving_loom"],
    "filtration": IMG["industrial_pipes"],
    "packaging": IMG["tea_packaging"],
    "other": IMG["coils_wire"],
}


def seed_all():
    db = SessionLocal()

    if db.query(User).count() > 2:
        db.close()
        return

    now = datetime.now(timezone.utc)

    # ── Category images ─────────────────────────
    for cat in db.query(Category).all():
        if cat.slug in CAT_IMG:
            cat.image_url = CAT_IMG[cat.slug]
    db.commit()

    # ── Users ───────────────────────────────────
    customers = [
        User(email="oleksandr@craft.ua", hashed_password=PASSWORD, full_name="Олександр Петренко",
             role=UserRole.CUSTOMER, city="Київ", phone="+380671112233",
             avatar_url=f"{U}/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=45),
        User(email="maria@craft.ua", hashed_password=PASSWORD, full_name="Марія Шевченко",
             role=UserRole.CUSTOMER, city="Одеса", phone="+380502223344",
             avatar_url=f"{U}/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=32),
        User(email="andriy@craft.ua", hashed_password=PASSWORD, full_name="Андрій Коваленко",
             role=UserRole.CUSTOMER, city="Харків", phone="+380633334455",
             avatar_url=f"{U}/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=18),
        User(email="natalia@craft.ua", hashed_password=PASSWORD, full_name="Наталія Бондаренко",
             role=UserRole.CUSTOMER, city="Дніпро", phone="+380954445566",
             avatar_url=f"{U}/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=27),
        User(email="dmytro@craft.ua", hashed_password=PASSWORD, full_name="Дмитро Ткаченко",
             role=UserRole.CUSTOMER, city="Львів", phone="+380665556677",
             avatar_url=f"{U}/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=12),
    ]
    manufacturers = [
        User(email="vasyl@maker.ua", hashed_password=PASSWORD, full_name="Василь Коваль",
             role=UserRole.MANUFACTURER, company_name="Майстерня Коваля", city="Львів",
             phone="+380671001001", bio="15 років досвіду в металообробці. Спеціалізуюсь на харчовому обладнанні з нержавіючої сталі.",
             avatar_url=f"{U}/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=87),
        User(email="ivan@maker.ua", hashed_password=PASSWORD, full_name="Іван Мельник",
             role=UserRole.MANUFACTURER, company_name="SteelCraft", city="Запоріжжя",
             phone="+380501002002", bio="Промислове обладнання на замовлення. Токарні, фрезерні, зварювальні роботи.",
             avatar_url=f"{U}/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=72),
        User(email="petro@maker.ua", hashed_password=PASSWORD, full_name="Петро Деревянко",
             role=UserRole.MANUFACTURER, company_name="WoodMaster", city="Івано-Франківськ",
             phone="+380631003003", bio="Деревообробка будь-якої складності. Від меблів до промислового обладнання з дерева.",
             avatar_url=f"{U}/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=65),
        User(email="olena@maker.ua", hashed_password=PASSWORD, full_name="Олена Гончар",
             role=UserRole.MANUFACTURER, company_name="CeramTech", city="Полтава",
             phone="+380951004004", bio="Виробництво керамічних та скляних виробів. Обладнання для гончарних майстерень.",
             avatar_url=f"{U}/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=54),
        User(email="sergiy@maker.ua", hashed_password=PASSWORD, full_name="Сергій Литвиненко",
             role=UserRole.MANUFACTURER, company_name="ФільтрПро", city="Чернігів",
             phone="+380661005005", bio="Системи фільтрації для харчової промисловості, тютюнової галузі, хімічної промисловості.",
             avatar_url=f"{U}/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=61),
        User(email="viktor@maker.ua", hashed_password=PASSWORD, full_name="Віктор Шаповалов",
             role=UserRole.MANUFACTURER, company_name="MetalArt", city="Київ",
             phone="+380671006006", bio="Художня металообробка та виготовлення нестандартного обладнання. Лазерне різання.",
             avatar_url=f"{U}/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=78),
        User(email="li.wang@maker.cn", hashed_password=PASSWORD, full_name="Li Wang",
             role=UserRole.MANUFACTURER, company_name="Shenzhen CraftEquip Co.", city="Шеньчжень, Китай",
             phone="+8613800138000", bio="Custom craft equipment manufacturer. Competitive prices, international shipping.",
             avatar_url=f"{U}/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=48),
        User(email="chen.wei@maker.cn", hashed_password=PASSWORD, full_name="Chen Wei",
             role=UserRole.MANUFACTURER, company_name="Guangzhou Steel Works", city="Гуанчжоу, Китай",
             phone="+8613900139000", bio="Stainless steel equipment for food & beverage industry. ISO 9001 certified.",
             avatar_url=f"{U}/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
             is_verified=True, rating=42),
    ]

    test_user = User(
        email="test@craft.ua", hashed_password=PASSWORD, full_name="Тестовий Майстер",
        role=UserRole.MANUFACTURER, company_name="TestCraft Studio", city="Київ",
        phone="+380991234567", bio="Універсальна майстерня — металообробка, зварювання, виготовлення харчового обладнання. 10 років досвіду.",
        avatar_url=f"{U}/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=face",
        is_verified=True, rating=91,
    )

    db.add_all(customers + manufacturers + [test_user])
    db.commit()
    for u in customers + manufacturers + [test_user]:
        db.refresh(u)

    cats = {c.slug: c for c in db.query(Category).all()}

    # ── Tenders ─────────────────────────────────
    tenders_data = [
        dict(title="Міні-пивоварня на 100л", owner=customers[0], cat="food-equipment",
             image_url=IMG["brewery_tanks"],
             description="Потрібна крафтова пивоварня з нержавіючої сталі AISI 304.\n\nКомплектація:\n- Затирочний котел 100л з мішалкою\n- Фільтраційна ємність з фальш-дном\n- Варильний котел 100л\n- Ферментатори 120л — 2 шт.\n- Чіллер пластинчастий\n- Система контролю температури\n\nМатеріал: нержавіюча сталь AISI 304, товщина стінки 1.5мм. Зварювання TIG.",
             budget_min=25000, budget_max=65000, location="Київ",
             deadline=now + timedelta(days=30)),
        dict(title="Дистиляційна колона для ефірних олій", owner=customers[1], cat="food-equipment",
             image_url=IMG["copper_stills"],
             description="Дистиляційна колона для виробництва ефірних олій з лаванди та м'яти.\n\nВимоги:\n- Об'єм перегонного куба: 50л\n- Колона тарілчаста або насадочна\n- Холодильник змієвиковий\n- Флорентійська склянка для сепарації\n- Матеріал: мідь або нержавійка\n- Можливість роботи на газу та електриці",
             budget_min=15000, budget_max=35000, location="Одеса",
             deadline=now + timedelta(days=21)),
        dict(title="Фрезерний стіл для ЧПУ-верстата", owner=customers[2], cat="metalwork",
             image_url=IMG["cnc_machine"],
             description="Потрібен фрезерний стіл для саморобного ЧПУ-верстата.\n\nРозміри робочого поля: 600x400мм\nМатеріал: алюмінієвий профіль + сталь\nТ-подібні пази для кріплення заготовок\nРівність поверхні: не гірше 0.05мм\nПотрібні кріплення та прижими в комплекті.",
             budget_min=8000, budget_max=18000, location="Харків",
             deadline=now + timedelta(days=14)),
        dict(title="Тигель для плавки скла (10кг)", owner=customers[3], cat="glass-ceramics",
             image_url=IMG["glassblowing"],
             description="Графітовий або керамічний тигель для плавки скла в невеликій майстерні.\n\nОб'єм: 10кг скломаси\nРобоча температура: до 1200°C\nСумісний з муфельною піччю\nБажано з кришкою та захоплювачем.",
             budget_min=3000, budget_max=8000, location="Дніпро",
             deadline=now + timedelta(days=10)),
        dict(title="Ручний ткацький верстат (ширина 120см)", owner=customers[4], cat="textile",
             image_url=IMG["weaving_loom"],
             description="Потрібен ручний ткацький верстат для виробництва крафтових тканин.\n\nШирина полотна: 120 см\nМатеріал рами: бук або дуб\n8 ремізок мінімум\nЗ набором бердо різної щільності\nЗбірно-розбірна конструкція для транспортування.",
             budget_min=12000, budget_max=28000, location="Львів",
             deadline=now + timedelta(days=25)),
        dict(title="Фільтр з мішком для тютюнового виробництва", owner=customers[0], cat="filtration",
             image_url=IMG["industrial_pipes"],
             description="Спеціалізований фільтр для очищення повітря на невеликому тютюновому виробництві.\n\nТип: мішковий фільтр\nПродуктивність: 500 м³/год\nФільтрувальний матеріал: поліестер\nКлас очистки: не нижче F7\nКорпус з нержавіючої сталі\nСистема зворотної продувки\nФланцеві з'єднання DN150.",
             budget_min=20000, budget_max=50000, location="Київ",
             deadline=now + timedelta(days=35)),
        dict(title="Автоматична пакувальна лінія для чаю", owner=customers[1], cat="packaging",
             image_url=IMG["tea_packaging"],
             description="Невелика пакувальна лінія для фасування розсипного крафтового чаю.\n\nПродуктивність: 200 пакетів/год\nФасовка: 50г, 100г, 250г\nТип пакету: дой-пак зі zip-замком\nВаговий дозатор\nДатувальник\nГабарити: не більше 2x1.5м.",
             budget_min=80000, budget_max=150000, location="Одеса",
             deadline=now + timedelta(days=45)),
        dict(title="Коптильна камера холодного копчення", owner=customers[2], cat="food-equipment",
             image_url=IMG["smoked_meat"],
             description="Камера для холодного копчення м'ясних та рибних виробів.\n\nОб'єм камери: ~1 м³\nМатеріал: нержавіюча сталь\nДимогенератор в комплекті\nТемпературний режим: 18-25°C\nСистема вентиляції та контролю температури\nДверці з ущільнювачем та оглядовим вікном.",
             budget_min=18000, budget_max=40000, location="Харків",
             deadline=now + timedelta(days=20)),
        dict(title="Верстат для різання скла (прямолінійний)", owner=customers[3], cat="glass-ceramics",
             image_url=IMG["glass_work"],
             description="Верстат для прямолінійного різання листового скла.\n\nМакс. розмір листа: 1200x800мм\nТовщина скла: 3-12мм\nНапрямні з лінійними підшипниками\nПритискна лінійка\nРіжучий ролик із твердого сплаву\nОснова: зварна сталева рама.",
             budget_min=10000, budget_max=25000, location="Дніпро",
             deadline=now + timedelta(days=18)),
        dict(title="Столярний верстак з притисками", owner=customers[4], cat="woodwork",
             image_url=IMG["workbench"],
             description="Професійний столярний верстак для невеликої майстерні.\n\nРозміри стільниці: 1800x700мм\nМатеріал стільниці: бук масив, товщина 80мм\nПередній та задній притиск\nНижня полиця для інструменту\nРегульовані опори\nМожливість кріплення лещат.",
             budget_min=8000, budget_max=20000, location="Львів",
             deadline=now + timedelta(days=15)),
        dict(title="Шнековий прес для олії (холодний віджим)", owner=customers[0], cat="food-equipment",
             image_url=IMG["olive_oil"],
             description="Шнековий прес для холодного віджиму олії з насіння соняшнику, льону, кунжуту.\n\nПродуктивність: 10-15 кг/год\nТемпература віджиму: до 40°C\nПотужність двигуна: 1.5-2.2 кВт\nМатеріал шнека: загартована сталь\nЖивлення: 220В.",
             budget_min=15000, budget_max=35000, location="Київ",
             deadline=now + timedelta(days=28)),
        dict(title="Намотувальний верстат для котушок", owner=customers[2], cat="other",
             image_url=IMG["coils_wire"],
             description="Верстат для намотування дроту на котушки (для виробництва трансформаторів).\n\nДіаметр дроту: 0.1-2.0мм\nМакс. ширина намотки: 150мм\nЛічильник витків\nРегулювання натягу\nРучний привод з можливістю моторизації.",
             budget_min=5000, budget_max=15000, location="Харків",
             deadline=now + timedelta(days=12)),
    ]

    tender_objs = []
    for td in tenders_data:
        t = Tender(
            title=td["title"], description=td["description"], owner_id=td["owner"].id,
            category_id=cats[td["cat"]].id if td["cat"] in cats else None,
            budget_min=td["budget_min"], budget_max=td["budget_max"],
            currency="UAH", status=TenderStatus.ACTIVE,
            image_url=td.get("image_url"),
            deadline=td.get("deadline"), location=td.get("location"),
            created_at=now - timedelta(hours=len(tenders_data) - len(tender_objs)),
        )
        db.add(t)
        db.commit()
        db.refresh(t)
        tender_objs.append(t)

    # ── Bids ────────────────────────────────────
    bids_data = [
        (tender_objs[0], manufacturers[0], 58000, "Маю великий досвід виробництва пивоварень. Все з AISI 304. Зварювання TIG.", 28),
        (tender_objs[0], manufacturers[1], 52000, "Можу виготовити за 3 тижні. Є доступ до листового прокату.", 21),
        (tender_objs[0], manufacturers[5], 61000, "Преміум якість. Полірування до дзеркального блиску.", 35),
        (tender_objs[0], manufacturers[6], 38000, "Competitive price with shipping included. 45 day delivery.", 45),
        (tender_objs[1], manufacturers[0], 28000, "Спеціалізуюсь на дистиляційному обладнанні. Мідний варіант.", 18),
        (tender_objs[1], manufacturers[1], 24000, "Нержавійка AISI 316. Повний комплект.", 14),
        (tender_objs[1], manufacturers[7], 18000, "All copper construction. CE certified.", 30),
        (tender_objs[2], manufacturers[1], 14500, "Алюмінієвий профіль 45x45 + фрезерована сталева плита.", 10),
        (tender_objs[2], manufacturers[5], 12000, "Лазерне різання + фрезерування. Точність 0.02мм.", 7),
        (tender_objs[3], manufacturers[3], 5500, "Керамічний тигель власного виробництва. Гарантія 50 плавок.", 7),
        (tender_objs[3], manufacturers[6], 3200, "Graphite crucible. Tested to 1400°C.", 20),
        (tender_objs[4], manufacturers[2], 22000, "Верстат з бука. 10 ремізок. Повний комплект бердо.", 30),
        (tender_objs[5], manufacturers[4], 42000, "Мішковий фільтр з автоматичною регенерацією. Повний проєкт.", 25),
        (tender_objs[5], manufacturers[1], 38000, "Корпус з AISI 304. Мішки поліестер. Клас F8.", 20),
        (tender_objs[5], manufacturers[6], 28000, "Complete bag filter system. Installation guide included.", 35),
        (tender_objs[6], manufacturers[6], 95000, "Full packaging line. Weigher + sealer + date coder.", 60),
        (tender_objs[6], manufacturers[7], 110000, "Automatic line with touch screen. 1 year warranty.", 50),
        (tender_objs[7], manufacturers[0], 32000, "Камера з AISI 304. Димогенератор на тріскі. Термодатчик.", 15),
        (tender_objs[7], manufacturers[5], 35000, "Преміум камера. Скляні дверцята. Wi-Fi термометр.", 18),
        (tender_objs[8], manufacturers[3], 18000, "Верстат з рамою та притискною лінійкою. Ролик Böhle.", 12),
        (tender_objs[9], manufacturers[2], 16000, "Бук масив 80мм. Передній притиск Veritas-тип.", 14),
        (tender_objs[10], manufacturers[0], 28000, "Шнек з загартованої сталі 45ХН. Корпус нержавійка.", 20),
        (tender_objs[10], manufacturers[1], 25000, "Є готовий проєкт. Продуктивність 12кг/год.", 14),
        (tender_objs[10], manufacturers[7], 19000, "Complete oil press. 15kg/hr capacity.", 40),
        (tender_objs[11], manufacturers[1], 11000, "Повністю металевий. Лічильник цифровий.", 8),
        (tender_objs[11], manufacturers[5], 9500, "Компактний верстат. Лічильник + натяг регульований.", 10),
    ]

    for tender, bidder, amount, message, days in bids_data:
        bid = TenderBid(
            tender_id=tender.id, bidder_id=bidder.id,
            amount=amount, currency="UAH",
            message=message, estimated_days=days,
            status=BidStatus.PENDING,
            created_at=tender.created_at + timedelta(hours=1),
        )
        db.add(bid)
    db.commit()

    # ── Portfolio ───────────────────────────────
    portfolio_data = [
        dict(owner=manufacturers[0], title="Крафтова пивоварня 200л",
             description="Повний комплект обладнання для крафтової пивоварні. Варильний котел, ферментатори, чіллер. Нержавіюча сталь AISI 304.",
             images=[IMG["brewery_tanks"]],
             tags=["пивоварня", "нержавійка", "AISI 304", "харчове обладнання"], materials="Нержавіюча сталь AISI 304", production_time_days=30),
        dict(owner=manufacturers[0], title="Дистиляційна установка мідна",
             description="Класична мідна дистиляційна колона з перегонним кубом 30л. Аламбік-стиль. Ручна робота, пайка срібним припоєм.",
             images=[IMG["copper_stills"]],
             tags=["дистиляція", "мідь", "аламбік"], materials="Мідь М1, срібний припій", production_time_days=21),
        dict(owner=manufacturers[1], title="ЧПУ-фрезер для алюмінію",
             description="Портальний фрезерний верстат з ЧПУ для обробки алюмінію. Робоче поле 800x600x150мм. Шпіндель 2.2кВт.",
             images=[IMG["cnc_machine"]],
             tags=["ЧПУ", "фрезер", "алюміній", "металообробка"], materials="Сталь, алюмінієвий профіль", production_time_days=45),
        dict(owner=manufacturers[1], title="Зварювальний поворотний стіл",
             description="Поворотний стіл для TIG-зварювання. Плавне регулювання обертів. Діаметр планшайби 300мм.",
             images=[IMG["welding"]],
             tags=["зварювання", "поворотний стіл", "TIG"], materials="Сталь 45", production_time_days=10),
        dict(owner=manufacturers[2], title="Токарний верстат по дереву",
             description="Ручний токарний верстат по дереву. Відстань між центрами 1000мм. Потужність 1.5кВт. Чавунна станина.",
             images=[IMG["wood_lathe"]],
             tags=["токарний", "дерево", "верстат"], materials="Чавун, сталь, бук", production_time_days=25),
        dict(owner=manufacturers[2], title="Столярний верстак преміум",
             description="Верстак з масиву бука. Стільниця 2000x800мм, товщина 90мм. Два притиски. Обробка натуральним маслом.",
             images=[IMG["workbench"]],
             tags=["столярний", "верстак", "бук", "преміум"], materials="Бук масив", production_time_days=20),
        dict(owner=manufacturers[3], title="Гончарне коло електричне",
             description="Електричне гончарне коло з безступінчатим регулюванням обертів. Потужність 350Вт. Діаметр диску 300мм.",
             images=[IMG["pottery_wheel"]],
             tags=["гончарне коло", "кераміка", "електричне"], materials="Сталь, алюміній", production_time_days=14),
        dict(owner=manufacturers[3], title="Муфельна піч 1200°C",
             description="Муфельна піч для випалу кераміки. Об'єм камери 40л. Макс. температура 1200°C. Програмований контролер.",
             images=[IMG["kiln_ceramics"]],
             tags=["піч", "кераміка", "випал", "муфельна"], materials="Вогнетривка цегла, ніхромова спіраль", production_time_days=18),
        dict(owner=manufacturers[4], title="Мішковий фільтр промисловий",
             description="Фільтрувальна установка мішкового типу для очищення повітря. 4 мішки, продуктивність 1000 м³/год.",
             images=[IMG["industrial_pipes"]],
             tags=["фільтр", "мішковий", "повітря", "промисловий"], materials="Нержавіюча сталь, поліестер", production_time_days=22),
        dict(owner=manufacturers[4], title="Циклонний пиловловлювач",
             description="Циклон для деревообробної майстерні. Продуктивність 2000 м³/год. Бункер для збору на 60л.",
             images=[IMG["ventilation"]],
             tags=["циклон", "пиловловлювач", "деревообробка"], materials="Оцинкована сталь", production_time_days=8),
        dict(owner=manufacturers[5], title="Декоративна кована огорожа",
             description="Секція кованої огорожі з елементами ручної ковки. Розмір секції 2000x1500мм. Гарячий цинк + порошкове фарбування.",
             images=[IMG["iron_gate"]],
             tags=["ковка", "огорожа", "декор"], materials="Сталь, гарячий цинк", production_time_days=7),
        dict(owner=manufacturers[5], title="Лазерне різання металу",
             description="Приклади робіт лазерного різання: деталі з листової сталі до 20мм, нержавійки до 12мм. Точність ±0.1мм.",
             images=[IMG["laser_cut"]],
             tags=["лазер", "різання", "сталь", "нержавійка"], materials="Різні метали", production_time_days=3),
        dict(owner=manufacturers[6], title="Complete Brewery System 500L",
             description="Full turnkey brewery system. Mash tun, lauter tun, brew kettle, whirlpool, heat exchanger, fermenters.",
             images=[IMG["brewery_craft"]],
             tags=["brewery", "stainless steel", "turnkey"], materials="AISI 304 Stainless Steel", production_time_days=60),
        dict(owner=manufacturers[7], title="Oil Press Machine (Cold Press)",
             description="Automatic screw oil press for sesame, sunflower, peanut. 20kg/hr capacity. Temperature control.",
             images=[IMG["olive_oil"]],
             tags=["oil press", "cold press", "food grade"], materials="Food grade stainless steel", production_time_days=30),
    ]

    for pd in portfolio_data:
        item = PortfolioItem(
            owner_id=pd["owner"].id, title=pd["title"],
            description=pd["description"],
            images=pd.get("images", []),
            tags=pd["tags"],
            materials=pd["materials"],
            production_time_days=pd["production_time_days"],
            created_at=now - timedelta(days=portfolio_data.index(pd)),
        )
        db.add(item)

    # ── Test user content ─────────────────────────
    # Tender created by test user (as customer)
    test_tender = Tender(
        title="Ємність для бродіння 60л з краном",
        description="Потрібна ємність з нержавійки для бродіння сидру.\n\n"
                    "Вимоги:\n- Об'єм: 60л\n- Матеріал: AISI 304\n- Кришка з гідрозатвором\n"
                    "- Кран-метелик внизу (DN25)\n- Термометр вбудований\n- Ніжки регульовані",
        owner_id=test_user.id,
        category_id=cats["food-equipment"].id,
        budget_min=5000, budget_max=12000,
        currency="UAH", status=TenderStatus.ACTIVE,
        image_url=IMG["brewery_tanks"],
        deadline=now + timedelta(days=20), location="Київ",
        created_at=now - timedelta(hours=5),
    )
    db.add(test_tender)
    db.commit()
    db.refresh(test_tender)

    for mfr, amt, msg, days in [
        (manufacturers[0], 9800, "Маю досвід виготовлення подібних ємностей. AISI 304, TIG-зварювання.", 12),
        (manufacturers[1], 8500, "Можу зробити за тиждень. Є матеріал на складі.", 7),
        (manufacturers[7], 5500, "Stainless steel fermenter. Shipping 14 days.", 25),
    ]:
        db.add(TenderBid(
            tender_id=test_tender.id, bidder_id=mfr.id,
            amount=amt, currency="UAH", message=msg, estimated_days=days,
            status=BidStatus.PENDING, created_at=test_tender.created_at + timedelta(hours=2),
        ))

    # Bids placed BY test user on other tenders
    for tender, amt, msg, days in [
        (tender_objs[0], 48000, "Маю готове рішення для пивоварні 100л. Повна комплектація, нержавійка AISI 304. Гарантія 2 роки.", 25),
        (tender_objs[1], 22000, "Виготовлю мідну колону аламбік-типу. 50л куб, змієвиковий холодильник. Пайка срібним припоєм.", 16),
        (tender_objs[7], 29000, "Камера холодного копчення з нержавійки. Димогенератор, Wi-Fi термометр, оглядове вікно.", 14),
        (tender_objs[10], 23000, "Шнековий прес з загартованої сталі. Продуктивність 12кг/год. Повна збірка + інструкція.", 18),
    ]:
        db.add(TenderBid(
            tender_id=tender.id, bidder_id=test_user.id,
            amount=amt, currency="UAH", message=msg, estimated_days=days,
            status=BidStatus.PENDING, created_at=tender.created_at + timedelta(hours=3),
        ))

    # Portfolio items for test user
    test_portfolio = [
        dict(title="Пивоварня крафтова 150л",
             description="Повний комплект: затирочний котел, фільтр-чан, варильник, 2 ферментатори. "
                         "Нержавійка AISI 304, TIG-зварювання, полірування внутрішніх швів.",
             images=[IMG["brewery_tanks"]],
             tags=["пивоварня", "нержавійка", "AISI 304"], materials="AISI 304", production_time_days=28),
        dict(title="Мідний аламбік 20л",
             description="Класичний мідний дистилятор ручної роботи. Перегонний куб 20л, "
                         "колона з дефлегматором, змієвиковий холодильник. Пайка срібним припоєм.",
             images=[IMG["copper_stills"]],
             tags=["дистиляція", "мідь", "аламбік", "ручна робота"], materials="Мідь М1, срібний припій", production_time_days=14),
        dict(title="Коптильна камера 0.5м³",
             description="Камера холодного/гарячого копчення. Нержавіюча сталь, димогенератор на тріскі, "
                         "цифровий контролер температури, оглядове вікно.",
             images=[IMG["smoked_meat"]],
             tags=["коптильня", "нержавійка", "холодне копчення"], materials="AISI 304", production_time_days=10),
    ]
    for p in test_portfolio:
        db.add(PortfolioItem(
            owner_id=test_user.id, title=p["title"],
            description=p["description"], images=p["images"],
            tags=p["tags"], materials=p["materials"],
            production_time_days=p["production_time_days"],
            created_at=now - timedelta(days=test_portfolio.index(p) + 1),
        ))

    db.commit()
    db.close()
