import 'package:flutter/material.dart';
import '../models/card.dart';
import '../services/card_service.dart';

class CardPickerScreen extends StatefulWidget {
  const CardPickerScreen({super.key});

  @override
  State<CardPickerScreen> createState() => _CardPickerScreenState();
}

class _CardPickerScreenState extends State<CardPickerScreen> {
  final _service = CardService();
  final _searchController = TextEditingController();
  List<CardModel> _cards = [];
  int _page = 1;
  int _totalCount = 0;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load({bool resetPage = false}) async {
    if (resetPage) _page = 1;
    setState(() => _loading = true);
    try {
      final result = await _service.search(
        search: _searchController.text.trim(),
        page: _page,
      );
      setState(() {
        _cards = result.cards;
        _totalCount = result.totalCount;
      });
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasMore = _page * 60 < _totalCount;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Choose a card'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: TextField(
              controller: _searchController,
              decoration: const InputDecoration(
                hintText: 'Search cards…',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
                isDense: true,
              ),
              onSubmitted: (_) => _load(resetPage: true),
            ),
          ),
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Expanded(
                  child: GridView.builder(
                    padding: const EdgeInsets.all(12),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      childAspectRatio: 0.7,
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                    ),
                    itemCount: _cards.length,
                    itemBuilder: (context, index) {
                      final card = _cards[index];
                      return InkWell(
                        onTap: () => Navigator.of(context).pop(card.id),
                        child: Column(
                          children: [
                            Expanded(
                                child: Image.network(card.imageUrl,
                                    fit: BoxFit.contain)),
                            Text(
                              card.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 11),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TextButton(
                        onPressed: _page > 1
                            ? () {
                                _page--;
                                _load();
                              }
                            : null,
                        child: const Text('Previous'),
                      ),
                      Text('Page $_page'),
                      TextButton(
                        onPressed: hasMore
                            ? () {
                                _page++;
                                _load();
                              }
                            : null,
                        child: const Text('Next'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}
