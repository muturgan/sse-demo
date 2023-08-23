const MyEventType = {
	HEARTBEAT: 'HEARTBEAT',
	RENDERED: 'RENDERED',
}

const STATUSES = {
	uploading: 'Баннер загружается на сервер.',
	uploaded: 'Баннер загружен на сервер. Идёт обработка.',
	finished: 'Обработка баннера завершена.',
	error: 'Ошибка :(',
};

const CSS_CLASSES = {
	[STATUSES.uploaded]: 'pending',
	[STATUSES.finished]: 'finished',
	[STATUSES.error]: 'error',
};

document.addEventListener(
	'DOMContentLoaded',
	() => {

		const button = document.body.querySelector('button');
		const table = document.body.querySelector('table');

		const tableRows = [];

		const addBunner = (bunnerId) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `<td>${bunnerId}</td><td>${STATUSES.uploading}</td>`;
			table.append(tr);
			tableRows.push(tr);
		};

		const updateBunnerStatus = (bunnerId, status) => {
			for (const tr of tableRows) {
				const [idColumn, statusColumn] = Array.from(tr.querySelectorAll('td'));

				if (idColumn.textContent === bunnerId) {
					console.log({status});
					console.log(statusColumn);

					const newTd = document.createElement('td');
					newTd.textContent = status;
					if (status in CSS_CLASSES) {
						newTd.classList.add(CSS_CLASSES[status])
					}
					statusColumn.replaceWith(newTd)

					break;
				}
			}
		};

		// я не буду опрашивать сервер каждые 10 секунд
		button.addEventListener('click', () => {
			const bunnerId = self.crypto.randomUUID();

			addBunner(bunnerId);

			// сделаю один сетевой запрос
			fetch(
				'api/render',
				{
					method: 'post',
					body: JSON.stringify({ requestId: bunnerId }),
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then((res) => {
					if (res.ok) {
						updateBunnerStatus(bunnerId, STATUSES.uploaded);
					}
					else {
						updateBunnerStatus(bunnerId, STATUSES.error);
					}
				})
				.catch(() => {
					updateBunnerStatus(bunnerId, STATUSES.error);
				});
		});

		const nestSource = new EventSource("/sse/nest");
		// const rawSource = new EventSource("/sse/raw");

		// а потом дождусь кода сервер сам меня уведомит о завершении фоновой задачи
		nestSource.addEventListener('message', (event) => {
			console.log('Новое событие с сервера!');
			console.log(event);
			console.log();

			let data;
			try {
				data = JSON.parse(event.data);
			} catch {
				console.error('ошибка парсинка серверного события');
				return;
			}

			if (data.type === MyEventType.RENDERED) {
				const bunnerId = data.payload.requestId;
				updateBunnerStatus(bunnerId, STATUSES.finished);
			}
		});

	},
	{once: true},
);
