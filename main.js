document.getElementById('search').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Loading...';
  
    try {
      const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
  
      resultsDiv.innerHTML = data
        .map(
          (item) => `
          <div class="product">
            <img src="${item.image}" alt="${item.title}" />
            <strong>${item.title}</strong><br/>
            Rating: ${item.rating} | Reviews: ${item.reviews}
          </div>`
        )
        .join('');
    } catch (err) {
      resultsDiv.innerHTML = 'An error occurred while fetching data.';
    }
  });
  