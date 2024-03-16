# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных
__IProductItem__  
_Интерфейс_ описывает информацию о продукте: 
- id: string — идентификатор продукта
- description?: string — описание товара
- image?: string — изображение товара
- title: string — название товара
- category?: string — категория товара
- price: number | null — цена товара 
__IAppState__
_Интерфейс_ описывает описывает структуру состояния для работы с продуктами и заказами:
-gallery: Массив объектов IProductItem, представляющих продукты в галерее. 
- basket: Массив строк, содержащих идентификаторы продуктов, добавленных в корзину.
- preview: Строка или значение null, представляющая идентификатор выбранного продукта для предпросмотра. Если ничего не выбрано для предпросмотра, поле будет содержать значение null.
- order: Объект типа IOrder или значение null, представляющее информацию о заказе. Если заказ не оформлен, поле будет содержать значение null.
__PaymentMethods__
Этот _тип_ используется для указания доступных методов оплаты: 'card' или 'cash'. 
__IOrderForm__  
_Интерфейс_ описывает данные формы заказа с выбором формы оплаты и заполнением адреса: 
- payment: PaymentMethods — способ оплаты
- address: string — адрес доставки
__IContactsForm__ 
_Интерфейс_ описывает данные формы заказа с контактными данными покупателя: 
- email: string — электронная почта клиента
- phone: string — телефон клиента  
__FieldsInput__
_Тип_ выбирает определенное свойство (address) и объединяет свойства из двух разных интерфейсов в один тип данных
__IOrder__
_Интерфейс_, который объединяет свойства из интерфейсов, а также содержит дополнительные поля:
- items: Массив строк, представляющих идентификаторы продуктов, включенных в заказ.
- total: Число, представляющее общую сумму заказа.
__FormErrors__
_тип_, который используется для представления ошибок формы. Представляет собой объект, где ключи соответствуют полям заказа, а значения представляют ошибки для соответствующих полей (если они есть).
__IOrderResult__  
_Интерфейс_ описывает результат заказа:  
- id: string — идентификатор заказа
- total: number — общая стоимость заказа


## Модели данных 
__CatalogItem__ Класс для управления товарами. 
- constructor(container: HTMLElement, actions?: ICardActions)
Создает новый экземпляр каталожного товара, используя контейнер HTML, в котором находится информация о товаре, и опциональные действия (например, обработчик нажатия на кнопку).
- setInBasket(value: boolean)
Устанавливает состояние товара в каталоге (добавлен в корзину или нет). Если товар добавлен в корзину, текст кнопки изменяется на "Перейти в корзину", в противном случае - на "Добавить в корзину".

__BasketItem__ Класс для управления корзиной. 
- constructor(container: HTMLElement, actions?: ICardActions)
Создает новый экземпляр товара в корзине, используя контейнер HTML, содержащий информацию о товаре, и обработчик нажатия на кнопку.
- handlePriceChange(event: MouseEvent)
Обрабатывает изменение цены товара в корзине (например, при изменении количества товара).


## Компоненты представления
__Component<T>__ - _абстрактный класс_ для наследования другими компонентами, которые будут реализовывать конкретную функциональность интерфейса.
Методы класса:
- constructor(container: HTMLElement): Конструктор класса, который принимает контейнер, в который будет рендериться компонент (карточка товара);
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключение класса элемента (отображение модальных окон);
- setText(element: HTMLElement, value: unknown) - установка текстового содержимого элемента.
- setDisabled(element: HTMLElement, state: boolean) - установка состояния блокировки элемента (кнопок при валидации);
- setImage(element: HTMLImageElement, src: string, alt?: string) - установка изображения и альтернативного текста.
- render(data?: Partial<T>): HTMLElement - отображение компонента. Принимает данные в виде объекта типа T и возвращает корневой DOM-элемент.
__Card__  
Представляет собой компонент карточки товара  
_Конструктор:_
- constructor(container: HTMLElement, actions?: ICardActions) - принимает контейнер, в который будет рендериться компонент, и дополнительные действия (если есть).
_Методы:_
- set id(value: string) - устанавливает идентификатор карточки.
- set title(value: string) - устанавливает название карточки.
- set image(value: string) - устанавливает изображение карточки.
- set category(value: string) - устанавливает категорию карточки.
- set inBasket(value: boolean) - устанавливает состояние "в корзине" для карточки.
- set price(value: string) - устанавливает цену карточки.
- set description(value: string | string[]) - устанавливает описание карточки.
_Классы:_ 
CatalogItem и BasketItem наследуют функционал класса Card и дополняют его специфическими свойствами и методами для каталога товаров и корзины соответственно.
__Modal__  
Представляет собой компонент модального окна  
_Конструктор:_
- constructor(container: HTMLElement, events: IEvents) - принимает контейнер модального окна и объект событий.
_Свойства:_
- _closeButton: HTMLButtonElement - кнопка закрытия модального окна.
- _content: HTMLElement - содержимое модального окна.
_Методы:_
- set content(value: HTMLElement) - устанавливает содержимое модального окна.
- open() - открывает модальное окно.
- order() - эмитирует событие открытия заказа.
- orderContacts() - эмитирует событие открытия контактов для заказа.
- close() - закрывает модальное окно.
- render(data: IModalData): HTMLElement - рендерит модальное окно с указанным содержимым. 
__Basket__ 
Представляет собой компонент корзины товаров. 
_Конструктор:_
- constructor(container: HTMLElement, events: EventEmitter) - принимает контейнер корзины и объект событий.
_Свойства:_
- _list: HTMLElement - список товаров в корзине.
- _total: HTMLElement - общая стоимость товаров в корзине.
- _button: HTMLElement - кнопка оформления заказа.
_Методы:_
- set items(items: HTMLElement[]) - устанавливает список товаров в корзине.
- set selected(items: ProductItem[]) - устанавливает выбранные товары в корзине и включает/отключает кнопку оформления заказа в зависимости от наличия выбранных товаров.
- set total(total: string) - устанавливает общую стоимость товаров в корзине.
__Form__  
Представляет собой компонент формы.
_Конструктор:_
- constructor(container: HTMLFormElement, events: IEvents) - принимает контейнер формы и объект событий.
_Свойства:_
- _submit: HTMLButtonElement - кнопка отправки формы.
- _errors: HTMLElement - элемент для отображения ошибок валидации формы.
_Методы:_
- set valid(value: boolean) - устанавливает состояние валидности формы.
- set errors(value: string) - устанавливает текст ошибки валидации формы.
- render(state: Partial<T> & IFormState) - отображает компонент формы и принимает состояние формы, включая валидность и ошибки валидации.
__Success__  
Представляет компонент, который отображает информацию об успешном завершении зааказа и отображает количество синапсов, списанных при этом действии. 
_Свойства:_
- _close: HTMLElement - элемент для закрытия сообщения об успешном завершении.
- _count: HTMLElement - элемент, отображающий информацию о количестве синапсов, списанных при успешном завершении действия.
- total: number - общее количество синапсов.
- onClick: () => void - функция обратного вызова, выполняемая при нажатии на кнопку закрытия.
_Конструктор:_
- Принимает контейнер, в который будет рендериться компонент, действия и количество синапсов.
- Инициализирует свойства _close и _count, находя соответствующие элементы в контейнере.
- Устанавливает текст в элементе _count для отображения количества синапсов, списанных при успешном завершении.
- Добавляет обработчик события клика на элемент _close для выполнения действий по закрытию сообщения об успешном завершении.
_Интерфейсы:_
- ISuccess - Интерфейс, описывающий структуру данных, необходимых для отображения компонента Success.
- ISuccessActions - Интерфейс, описывающий действия, которые могут быть выполнены при успешном завершении.

## Описание событий
Будем использовать EventEmitter для работы с событиями в коде приложения, использует паттерн наблюдатель

События, связанные с изменением данных:
- items:changed: Событие, возникающее при изменении элементов в каталоге товаров. При возникновении этого события необходимо перерисовать каталог товаров на странице.
- preview:changed: Событие, возникающее при изменении предпросмотра товара. При его возникновении необходимо отобразить предпросмотр товара с обновленной информацией.
- basket:update: Событие, вызываемое при обновлении содержимого корзины. При его возникновении необходимо обновить отображение корзины на странице.
- basket:remove: Событие, сигнализирующее о необходимости удаления товара из корзины. При его возникновении соответствующий товар должен быть удален из корзины.
- basket:clear: Событие, сигнализирующее о необходимости очистки корзины. При его возникновении все товары должны быть удалены из корзины, а счетчик товаров обнулится.
- order:submit: Событие, вызываемое при отправке формы заказа. При его возникновении необходимо открыть форму для ввода контактных данных.
- contacts:submit: Событие, происходящее при отправке контактных данных. При его возникновении заказ должен быть отправлен на сервер, а затем пользователю показано сообщение об успешном оформлении заказа.
- formErrors:change: Событие, вызываемое при изменении ошибок валидации формы. При его возникновении необходимо обновить состояние валидации формы и отобразить соответствующие сообщения об ошибках.
- payment:change: Событие, возникающее при изменении метода оплаты. При его возникновении необходимо обновить выбранный метод оплаты в форме заказа.

События, генерируемые компонентами представления:
- modal:open: Событие, вызываемое при открытии модального окна. При его возникновении страница должна быть заблокирована.
- modal:close: Событие, сигнализирующее о закрытии модального окна. При его возникновении страница должна быть разблокирована.
basket:open: Событие, вызываемое при открытии корзины. При его возникновении необходимо отобразить содержимое корзины.
- order:open: Событие, вызываемое при открытии формы заказа. При его возникновении необходимо отобразить форму заказа с пустыми полями.
- orderContacts:open: Событие, происходящее при открытии формы для ввода контактных данных в заказе. При его возникновении необходимо отобразить форму для ввода контактных данных с пустыми полями.
