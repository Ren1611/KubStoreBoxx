import scss from "./Service.module.scss";

const Service = () => {
  return (
    <div>
      <div id={scss.service}>
        <div className="container">
          <div className={scss.service}>
            <div className={scss.nomer1}>
              <h1>Мотосервис</h1>
              <h2>
                Сервисные центры "KubStore" в Бишкеке, Первомайская область,
                Иссык-куле и Нарыне:
              </h2>
              <p>
                Мотосервис «KubStore» предлагает полный спектр услуг по
                обслуживанию и ремонту мотоциклов. Мы работаем как с
                повседневной техникой, так и с мотоциклами для дальних поездок,
                спорта и активной эксплуатации. Наша основная задача —
                обеспечить надёжную, безопасную и стабильную работу мотоцикла в
                любых условиях. Сервис «KubStore» оснащён современным
                диагностическим и ремонтным оборудованием, что позволяет точно
                определять неисправности и выполнять работы в соответствии с
                техническими стандартами производителей. Все процессы
                обслуживания выстроены таким образом, чтобы клиент получал
                понятный результат, прозрачную стоимость и соблюдение
                оговорённых сроков.
              </p>
              <div className={scss.serviceImg}>
                <img src="./src/assets/images/ServicesImg.webp" alt="" />
                <img src="./src/assets/images/ServicesImg (1).webp" alt="" />
              </div>
            </div>
            <div className={scss.nomer2}>
              <div className={scss.rux}>
                <h1>Наши услуги</h1>
              </div>
              <ul>
                <li>Плановое техническое обслуживание</li>
                <li>Комплексная диагностика</li>
                <li>Ремонт и обслуживание двигателя</li>
                <li>Ремонт трансмиссии</li>
                <li>Обслуживание и настройка подвески</li>
                <li>Тормозные системы</li>
                <li>Электрооборудование и проводка</li>
                <li>Шиномонтаж и балансировка</li>
                <li>Подготовка мотоцикла к сезону</li>
                <li>Установка дополнительного оборудования и аксессуаров</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div id={scss.HomeSer}>
        <div className="container">
          <div className={scss.HomeSer}>
            <div className={scss.room}>
              <h2 className={scss.Ho}>Адрес</h2>
              <h2 className={scss.Oo}>Телефон</h2>
              <h2 className={scss.Po}>email</h2>
            </div>
            <div className={scss.line}>
              <div className={scss.blog}>
                <h3>Мотосервис Можайское шоссе</h3>
                <h4 className={scss.top}>г. Бишкек, ул. Токтоналиева 123/1 </h4>
                <h4 className={scss.botton}>
                  Ремонт: Husqvarna, мотоциклы, квадроциклы
                </h4>
              </div>
              <div className={scss.Phon}>
                <h4>+996 555 123 456</h4>
                <h4>доб. 1029</h4>
              </div>
              <div className={scss.email}>
                <a href="#">becbo@gmail.com</a>
              </div>
            </div>
            <div className={scss.line2}>
              <div className={scss.blog}>
                <h3>Мотосервис Проспект Мира</h3>
                <h4 className={scss.top}>Проспект Мира, д. 163 </h4>
              </div>
              <div className={scss.pop}>
                <h4>+7 (495) 926-52-01</h4>
                <h4>доб. 1119</h4>
              </div>
              <div className={scss.email}>
                <a href="#">murza@gmail.com</a>
              </div>
            </div>
            <div className={scss.line}>
              <div className={scss.blog}>
                <h3>Мотосервис Санкт-Петербург</h3>
                <h4 className={scss.top}>Кушелевская дорога, 12 </h4>
              </div>
              <div className={scss.poop}>
                <h4>+7 (812) 633-07-77</h4>
                <h4>доб. 2106</h4>
              </div>
              <div className={scss.email}>
                <a href="#">Kuba@gmail.com</a>
              </div>
            </div>
            <div className={scss.line2}>
              <div className={scss.blog}>
                <h3>Мотосервис Краснодар</h3>
                <h4 className={scss.top}>ул. Дзержинского, 199 </h4>
              </div>
              <div className={scss.lox}>
                <h4>+7 (861) 205-75-52</h4>
                <h4>доб. 1205</h4>
              </div>
              <div className={scss.email}>
                <a href="#">murmur@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
