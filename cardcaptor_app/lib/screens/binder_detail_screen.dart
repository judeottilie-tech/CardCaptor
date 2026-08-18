import 'package:flutter/material.dart';
import '../models/binder_page.dart';
import '../models/binder_page_card_slot.dart';
import '../services/binder_page_service.dart';
import 'card_picker_screen.dart';

class BinderDetailScreen extends StatefulWidget {
  final int binderId;
  const BinderDetailScreen({super.key, required this.binderId});

  @override
  State<BinderDetailScreen> createState() => _BinderDetailScreenState();
}

class _BinderDetailScreenState extends State<BinderDetailScreen> {
  final _service = BinderPageService();
  late Future<BinderPage> _futureBinder;

  @override
  void initState() {
    super.initState();
    _futureBinder = _service.getById(widget.binderId);
  }

  void _reload() {
    setState(() {
      _futureBinder = _service.getById(widget.binderId);
    });
  }

  Future<void> _tapSlot(BinderPageCardSlot slot) async {
    if (slot.card != null) {
      // Slot filled: offer to remove it.
      final remove = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text(slot.card!.name),
          content: const Text('Remove this card from the slot?'),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel')),
            FilledButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Remove')),
          ],
        ),
      );
      if (remove == true) {
        await _service.setSlotCard(slot.id, null);
        _reload();
      }
    } else {
      // Slot empty: open the card picker.
      final selectedCardId = await Navigator.of(context).push<int>(
        MaterialPageRoute(builder: (_) => const CardPickerScreen()),
      );
      if (selectedCardId != null) {
        await _service.setSlotCard(slot.id, selectedCardId);
        _reload();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Binder')),
      body: FutureBuilder<BinderPage>(
        future: _futureBinder,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
                child: Text('Failed to load binder: ${snapshot.error}'));
          }
          final binder = snapshot.data!;
          final slots = [...(binder.slots ?? [])]
            ..sort((a, b) => a.position.compareTo(b.position));

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(binder.title,
                    style: Theme.of(context).textTheme.headlineSmall),
              ),
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 0.7,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: slots.length,
                  itemBuilder: (context, index) {
                    final slot = slots[index];
                    return _SlotTile(slot: slot, onTap: () => _tapSlot(slot));
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _SlotTile extends StatelessWidget {
  final BinderPageCardSlot slot;
  final VoidCallback onTap;
  const _SlotTile({required this.slot, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final card = slot.card;
    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade400),
          borderRadius: BorderRadius.circular(8),
        ),
        child: card == null
            ? const Center(child: Icon(Icons.add, color: Colors.grey))
            : Column(
                children: [
                  Expanded(
                    child: Image.network(card.imageUrl, fit: BoxFit.contain),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(4),
                    child: Text(
                      card.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 11),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
