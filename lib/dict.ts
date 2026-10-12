type D = Record<string, string>

const ru: D = {
  'app.title': 'Number# — твоя личность в одном номере',
  'app.desc': 'Уникальный номер вместо юзернейма. Профиль, подписки, записи.',
  'time.now': 'только что',

  'nav.aria': 'Основная навигация', 'nav.home_aria': 'Number# — на главную', 'nav.close': 'Закрыть меню', 'nav.menu': 'Меню', 'nav.more': 'Ещё',
  'nav.feed': 'Лента', 'nav.search': 'Поиск', 'nav.profile': 'Профиль', 'nav.mynumber': 'Мой номер', 'nav.settings': 'Настройки',
  'nav.create_community': 'Создать сообщество', 'nav.login': 'Войти', 'nav.register': 'Регистрация', 'nav.logout': 'Выйти',
  'theme.label': 'Оформление', 'theme.light': 'Светлая', 'theme.dark': 'Тёмная', 'theme.to_dark': 'Тёмная тема', 'theme.to_light': 'Светлая тема',
  'lang.label': 'Язык', 'lang.switch': 'Сменить язык',

  'common.cancel': 'Отмена', 'common.clear': 'Очистить', 'common.close': 'Закрыть', 'common.copied': 'Скопировано ✓', 'common.copy': 'Копировать',
  'common.copy_number': 'Скопировать номер', 'common.delete': 'Удалить', 'common.edit': 'Изменить', 'common.loading': 'Загрузка…', 'common.more': 'Показать ещё',
  'common.no_name': 'Без имени', 'common.profile_missing': 'Профиль не найден.', 'common.save': 'Сохранить', 'common.saved': 'Сохранено.',
  'common.saving': 'Сохраняем…', 'common.wait': 'Подождите…',

  'auth.title_register': 'Получи свой номер', 'auth.title_login': 'С возвращением',
  'auth.note_register': 'Нужны только почта и пароль. Имя, фото и ссылки — позже, по желанию.',
  'auth.email': 'Почта', 'auth.password': 'Пароль (от 8 символов)',
  'auth.err_email': 'Введите корректную почту.', 'auth.err_password': 'Пароль — минимум 8 символов.',
  'auth.err_register': 'Не удалось зарегистрироваться: {m}', 'auth.err_login': 'Неверная почта или пароль.',
  'auth.err_exists': 'Эта почта уже зарегистрирована. Войдите.', 'auth.confirm': 'Почти готово: подтвердите почту по письму, затем войдите.',
  'auth.submit_register': 'Зарегистрироваться', 'auth.submit_login': 'Войти',
  'auth.have_account': 'Уже есть номер?', 'auth.no_account': 'Ещё нет номера?',

  'home.yournumber': 'Ваш номер', 'home.qr': 'QR-код', 'home.open_feed': 'Открыть ленту', 'home.find': 'Найти человека по номеру',
  'home.communities': 'Ваши сообщества', 'home.no_communities': 'Вы пока не управляете сообществами.',
  'home.title1': 'Твоя личность.', 'home.title2': 'В одном номере.',
  'home.sub': 'Скажи «я 728», и тебя найдут. Никаких длинных юзернеймов: номер, профиль, подписки и записи.',
  'home.get_number': 'Получить номер', 'home.example': 'Пример профиля', 'home.example_name': 'Имя Фамилия', 'home.example_bio': 'Пара слов о себе',
  'home.step1_t': 'Зарегистрируйтесь', 'home.step1_d': 'Нужны только почта и пароль. Номер выдаётся автоматически.',
  'home.step2_t': 'Назовите номер', 'home.step2_d': 'Человек вводит его в поиск и сразу попадает в ваш профиль.',
  'home.step3_t': 'Подпишитесь друг на друга', 'home.step3_d': 'Следите за записями, ведите стену и прячьте ссылки от посторонних.',

  'search.title': 'Найти по номеру', 'search.aria': 'Номер', 'search.go': 'Найти', 'search.busy': 'Ищем…',
  'search.err': 'Введите номер: от 1 до 6 цифр.', 'search.none': 'Этот номер пока не занят.',

  'kind.telegram': 'Telegram', 'kind.instagram': 'Instagram', 'kind.vk': 'VK', 'kind.website': 'Сайт', 'kind.other': 'Другое',
  'link.followers_only': 'Только подписчикам',

  'photo.err_type': 'Фото: JPG, PNG или WebP.', 'photo.err_size': 'Фото должно быть меньше {mb} МБ.', 'photo.err_upload': 'Не удалось загрузить фото: {m}',
  'composer.placeholder': 'Что нового?', 'composer.aria': 'Текст записи', 'composer.remove': 'убрать', 'composer.photo': 'Фото',
  'composer.publish': 'Опубликовать', 'composer.busy': 'Публикуем…', 'composer.err': 'Не удалось опубликовать: {m}',
  'gallery.aria': 'Фотографии', 'gallery.open': 'Открыть фото', 'gallery.photo': 'Фото', 'gallery.more': 'Ещё фото', 'gallery.to_post': 'К записи',
  'qr.share': 'Поделиться', 'qr.copied': 'Ссылка скопирована', 'qr.download': 'Скачать QR',
  'posts.err_load': 'Не удалось загрузить записи. Попробуйте ещё раз.', 'post.edited': 'изменено', 'post.confirm_delete': 'Удалить запись?',
  'comments.title': 'Комментарии', 'comments.hide': 'Скрыть комментарии', 'comments.none': 'Комментариев пока нет.',
  'comments.placeholder': 'Написать комментарий', 'comments.aria': 'Комментарий', 'comments.delete': 'Удалить комментарий', 'comments.login': 'Войдите, чтобы комментировать.',

  'follow.follow': 'Подписаться', 'follow.sent': 'Заявка отправлена', 'follow.cancel': 'Отменить заявку', 'follow.following': 'Вы подписаны',
  'follow.unfollow': 'Отписаться', 'follow.wants': 'Хочет подписаться', 'follow.accept': 'Принять заявку', 'follow.decline': 'Отклонить заявку', 'follow.remove': 'Удалить подписчика',
  'lists.followers': 'Подписчики', 'lists.following': 'Подписки', 'lists.search': 'Имя или номер', 'lists.search_aria': 'Поиск по списку',
  'lists.no_followers': 'Подписчиков пока нет.', 'lists.no_following': 'Подписок пока нет.', 'lists.nobody_found': 'Никого не найдено.',
  'lists.err': 'Не удалось загрузить список. Попробуйте ещё раз.', 'lists.confirm_remove': 'Удалить подписчика?', 'lists.locked': 'Список видят только подписчики.',
  'requests.title': 'Заявки на подписку', 'requests.none': 'Заявок нет.', 'requests.incoming': 'Входящие', 'requests.sent': 'Отправленные',

  'profile.free': 'Этот номер пока свободен.', 'profile.private': 'Закрытый профиль', 'profile.no_bio': 'Профиль пока не заполнен.',
  'profile.number_fallback': 'Номер {n}', 'profile.login_to_follow': 'Войти, чтобы подписаться', 'profile.edit': 'Редактировать', 'profile.requests': 'Заявки',
  'profile.qr': 'QR-код профиля', 'profile.hidden': 'Записи этого профиля видят только подписчики.', 'profile.empty': 'Записей пока нет.', 'profile.empty_own': 'Здесь появятся ваши записи.',
  'profile.followers.one': 'подписчик', 'profile.followers.few': 'подписчика', 'profile.followers.many': 'подписчиков', 'profile.followers.other': 'подписчиков',
  'profile.following.one': 'подписка', 'profile.following.few': 'подписки', 'profile.following.many': 'подписок', 'profile.following.other': 'подписок',

  'edit.title': 'Настройки', 'edit.upload': 'Загрузить фото', 'edit.name': 'Имя', 'edit.name_ph': 'Как вас зовут', 'edit.bio': 'О себе', 'edit.bio_ph': 'Пара слов о себе',
  'edit.private': 'Закрытый профиль',
  'edit.private_note': 'Подписаться можно только по заявке, которую вы одобряете. Записи и ссылки «только подписчикам» видят одобренные подписчики. В открытом профиле подписка одобряется сразу.',
  'edit.links_note': 'Ссылки (необязательно, до 10). Для каждой выберите, кто её видит.', 'edit.link_type': 'Тип ссылки', 'edit.link_label': 'Название',
  'edit.link_ph': '@имя или ссылка', 'edit.visibility': 'Кто видит', 'edit.vis_public': '🌍 Всем', 'edit.vis_followers': '🔒 Только подписчикам',
  'edit.add_link': '+ Добавить ссылку', 'edit.photo_ready': 'Фото загружено. Нажмите «Сохранить».', 'edit.err': 'Не удалось сохранить: {m}',

  'dashboard.my_profile': 'Мой профиль', 'dashboard.completion': 'Профиль заполнен', 'dashboard.fill': 'Заполнить профиль',
  'dashboard.requests.one': 'Новая заявка на подписку: {n}', 'dashboard.requests.few': 'Новых заявок на подписку: {n}', 'dashboard.requests.many': 'Новых заявок на подписку: {n}', 'dashboard.requests.other': 'Новых заявок на подписку: {n}',
  'feed.empty': 'Здесь пока пусто. Подпишитесь на людей и сообщества по номеру — их записи появятся в ленте.',

  'community.badge': 'Сообщество', 'community.no_bio': 'У сообщества пока нет описания.', 'community.admins': 'Администраторы', 'community.manage': 'Управление',
  'community.create_title': 'Создать сообщество', 'community.create_note': 'Сообщество получает собственный номер, стену и подписчиков. Вы станете его владельцем.',
  'community.name': 'Название', 'community.name_ph': 'Например, команда, бренд или клуб', 'community.description': 'Описание (необязательно)',
  'community.create_btn': 'Создать', 'community.err_name': 'Укажите название.', 'community.err_limit': 'Можно создать не больше 10 сообществ.', 'community.err_create': 'Не удалось создать: {m}',
  'manage.requests': 'Заявки на подписку', 'manage.private': 'Закрытое сообщество', 'manage.private_note': 'Подписаться можно только по заявке. Записи видят подписчики и администраторы.',
  'manage.owner': 'Владелец', 'manage.admin': 'Администратор', 'manage.add_ph': 'Номер человека', 'manage.add': 'Добавить', 'manage.admin_added': 'Администратор добавлен.',
  'manage.err_person': 'Человек с таким номером не найден.', 'manage.danger': 'Удаление сообщества',
  'manage.delete_note': 'Будут удалены записи, комментарии и подписки сообщества. Действие необратимо. Введите номер {n}, чтобы подтвердить.',
  'manage.delete_aria': 'Номер сообщества для подтверждения', 'manage.delete': 'Удалить', 'manage.err_confirm': 'Номер для подтверждения введён неверно.',

  'error.title': 'Что-то пошло не так.', 'error.note': 'Проверьте соединение и попробуйте ещё раз.', 'error.retry': 'Повторить',
  'notfound.title': 'Такой страницы нет.', 'notfound.home': 'На главную',
}

const en: D = {
  'app.title': 'Number# — your identity in one number',
  'app.desc': 'A unique number instead of a username. Profile, follows, posts.',
  'time.now': 'just now',

  'nav.aria': 'Main navigation', 'nav.home_aria': 'Number# — home', 'nav.close': 'Close menu', 'nav.menu': 'Menu', 'nav.more': 'More',
  'nav.feed': 'Feed', 'nav.search': 'Search', 'nav.profile': 'Profile', 'nav.mynumber': 'My number', 'nav.settings': 'Settings',
  'nav.create_community': 'Create a community', 'nav.login': 'Log in', 'nav.register': 'Sign up', 'nav.logout': 'Log out',
  'theme.label': 'Appearance', 'theme.light': 'Light', 'theme.dark': 'Dark', 'theme.to_dark': 'Dark theme', 'theme.to_light': 'Light theme',
  'lang.label': 'Language', 'lang.switch': 'Change language',

  'common.cancel': 'Cancel', 'common.clear': 'Clear', 'common.close': 'Close', 'common.copied': 'Copied ✓', 'common.copy': 'Copy',
  'common.copy_number': 'Copy number', 'common.delete': 'Delete', 'common.edit': 'Edit', 'common.loading': 'Loading…', 'common.more': 'Show more',
  'common.no_name': 'No name', 'common.profile_missing': 'Profile not found.', 'common.save': 'Save', 'common.saved': 'Saved.',
  'common.saving': 'Saving…', 'common.wait': 'Please wait…',

  'auth.title_register': 'Get your number', 'auth.title_login': 'Welcome back',
  'auth.note_register': 'You only need an email and a password. Name, photo and links can wait.',
  'auth.email': 'Email', 'auth.password': 'Password (8+ characters)',
  'auth.err_email': 'Enter a valid email.', 'auth.err_password': 'Password must be at least 8 characters.',
  'auth.err_register': 'Could not sign up: {m}', 'auth.err_login': 'Wrong email or password.',
  'auth.err_exists': 'This email is already registered. Please log in.', 'auth.confirm': 'Almost there: confirm your email from the message, then log in.',
  'auth.submit_register': 'Sign up', 'auth.submit_login': 'Log in',
  'auth.have_account': 'Already have a number?', 'auth.no_account': 'No number yet?',

  'home.yournumber': 'Your number', 'home.qr': 'QR code', 'home.open_feed': 'Open feed', 'home.find': 'Find a person by number',
  'home.communities': 'Your communities', 'home.no_communities': 'You do not manage any communities yet.',
  'home.title1': 'Your identity.', 'home.title2': 'In one number.',
  'home.sub': 'Say “I’m 728” and people will find you. No long usernames: a number, a profile, follows and posts.',
  'home.get_number': 'Get your number', 'home.example': 'Sample profile', 'home.example_name': 'First Last', 'home.example_bio': 'A few words about me',
  'home.step1_t': 'Sign up', 'home.step1_d': 'Only an email and a password. Your number is assigned automatically.',
  'home.step2_t': 'Say your number', 'home.step2_d': 'People type it into search and land on your profile.',
  'home.step3_t': 'Follow each other', 'home.step3_d': 'Follow posts, keep your own wall and hide links from strangers.',

  'search.title': 'Find by number', 'search.aria': 'Number', 'search.go': 'Find', 'search.busy': 'Searching…',
  'search.err': 'Enter a number: 1 to 6 digits.', 'search.none': 'This number is not taken yet.',

  'kind.telegram': 'Telegram', 'kind.instagram': 'Instagram', 'kind.vk': 'VK', 'kind.website': 'Website', 'kind.other': 'Other',
  'link.followers_only': 'Followers only',

  'photo.err_type': 'Photo must be JPG, PNG or WebP.', 'photo.err_size': 'Photo must be under {mb} MB.', 'photo.err_upload': 'Could not upload the photo: {m}',
  'composer.placeholder': 'What’s new?', 'composer.aria': 'Post text', 'composer.remove': 'remove', 'composer.photo': 'Photo',
  'composer.publish': 'Post', 'composer.busy': 'Posting…', 'composer.err': 'Could not post: {m}',
  'gallery.aria': 'Photos', 'gallery.open': 'Open photo', 'gallery.photo': 'Photo', 'gallery.more': 'More photos', 'gallery.to_post': 'Go to post',
  'qr.share': 'Share', 'qr.copied': 'Link copied', 'qr.download': 'Download QR',
  'posts.err_load': 'Could not load posts. Please try again.', 'post.edited': 'edited', 'post.confirm_delete': 'Delete this post?',
  'comments.title': 'Comments', 'comments.hide': 'Hide comments', 'comments.none': 'No comments yet.',
  'comments.placeholder': 'Write a comment', 'comments.aria': 'Comment', 'comments.delete': 'Delete comment', 'comments.login': 'Log in to comment.',

  'follow.follow': 'Follow', 'follow.sent': 'Request sent', 'follow.cancel': 'Cancel request', 'follow.following': 'Following',
  'follow.unfollow': 'Unfollow', 'follow.wants': 'Wants to follow', 'follow.accept': 'Accept', 'follow.decline': 'Decline', 'follow.remove': 'Remove follower',
  'lists.followers': 'Followers', 'lists.following': 'Following', 'lists.search': 'Name or number', 'lists.search_aria': 'Search the list',
  'lists.no_followers': 'No followers yet.', 'lists.no_following': 'Not following anyone yet.', 'lists.nobody_found': 'Nobody found.',
  'lists.err': 'Could not load the list. Please try again.', 'lists.confirm_remove': 'Remove this follower?', 'lists.locked': 'Only followers can see this list.',
  'requests.title': 'Follow requests', 'requests.none': 'No requests.', 'requests.incoming': 'Incoming', 'requests.sent': 'Sent',

  'profile.free': 'This number is still free.', 'profile.private': 'Private profile', 'profile.no_bio': 'This profile is not filled in yet.',
  'profile.number_fallback': 'Number {n}', 'profile.login_to_follow': 'Log in to follow', 'profile.edit': 'Edit profile', 'profile.requests': 'Requests',
  'profile.qr': 'Profile QR code', 'profile.hidden': 'Only followers can see this profile’s posts.', 'profile.empty': 'No posts yet.', 'profile.empty_own': 'Your posts will appear here.',
  'profile.followers.one': 'follower', 'profile.followers.other': 'followers',
  'profile.following.one': 'following', 'profile.following.other': 'following',

  'edit.title': 'Settings', 'edit.upload': 'Upload photo', 'edit.name': 'Name', 'edit.name_ph': 'Your name', 'edit.bio': 'About', 'edit.bio_ph': 'A few words about you',
  'edit.private': 'Private profile',
  'edit.private_note': 'People can follow only with your approval. Posts and “followers only” links are visible to approved followers. For an open profile, following is approved instantly.',
  'edit.links_note': 'Links (optional, up to 10). Choose who can see each one.', 'edit.link_type': 'Link type', 'edit.link_label': 'Label',
  'edit.link_ph': '@name or link', 'edit.visibility': 'Who can see', 'edit.vis_public': '🌍 Everyone', 'edit.vis_followers': '🔒 Followers only',
  'edit.add_link': '+ Add link', 'edit.photo_ready': 'Photo uploaded. Press “Save”.', 'edit.err': 'Could not save: {m}',

  'dashboard.my_profile': 'My profile', 'dashboard.completion': 'Profile completed', 'dashboard.fill': 'Complete your profile',
  'dashboard.requests.one': '{n} new follow request', 'dashboard.requests.other': '{n} new follow requests',
  'feed.empty': 'Nothing here yet. Follow people and communities by number and their posts will show up here.',

  'community.badge': 'Community', 'community.no_bio': 'This community has no description yet.', 'community.admins': 'Admins', 'community.manage': 'Manage',
  'community.create_title': 'Create a community', 'community.create_note': 'A community gets its own number, wall and followers. You will be its owner.',
  'community.name': 'Name', 'community.name_ph': 'For example, a team, brand or club', 'community.description': 'Description (optional)',
  'community.create_btn': 'Create', 'community.err_name': 'Enter a name.', 'community.err_limit': 'You can create up to 10 communities.', 'community.err_create': 'Could not create: {m}',
  'manage.requests': 'Follow requests', 'manage.private': 'Private community', 'manage.private_note': 'People can follow only by request. Posts are visible to followers and admins.',
  'manage.owner': 'Owner', 'manage.admin': 'Admin', 'manage.add_ph': 'Person’s number', 'manage.add': 'Add', 'manage.admin_added': 'Admin added.',
  'manage.err_person': 'No person with this number.', 'manage.danger': 'Delete community',
  'manage.delete_note': 'Posts, comments and followers of the community will be deleted. This cannot be undone. Type the number {n} to confirm.',
  'manage.delete_aria': 'Community number to confirm', 'manage.delete': 'Delete', 'manage.err_confirm': 'The confirmation number is wrong.',

  'error.title': 'Something went wrong.', 'error.note': 'Check your connection and try again.', 'error.retry': 'Try again',
  'notfound.title': 'This page does not exist.', 'notfound.home': 'Back to home',
}

export const dict: Record<'ru' | 'en', D> = { ru, en }
