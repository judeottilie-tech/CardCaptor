import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/binder_page.dart';
import '../services/auth_state.dart';
import '../services/binder_page_service.dart';
import 'binder_detail_screen.dart';
import 'pet_screen.dart';

class BinderListScreen extends StatefulWidget {
  const BinderListScreen({super.key});

  @override
  State<BinderListScreen> createState() => _BinderListScreenState();
}

class _BinderListScreenState extends State<BinderListScreen> {
  final _service = BinderPageService();
  late Future<List<BinderPage>> _futureBinders;

  @override
  void initState() {
    super.initState();
    _futureBinders = _service.getAll();
  }

  void _reload() {
    setState(() {
      _futureBinders = _service.getAll();
    });
  }

  Future<void> _createBinder() async {
    final titleController = TextEditingController();
    final title = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('New binder'),
        content: TextField(
          controller: titleController,
          decoration: const InputDecoration(labelText: 'Title'),
          autofocus: true,
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          FilledButton(
            onPressed: () =>
                Navigator.pop(context, titleController.text.trim()),
            child: const Text('Create'),
          ),
        ],
      ),
    );
    if (title != null && title.isNotEmpty) {
      await _service.create(title, null);
      _reload();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Binders'),
        actions: [
          IconButton(
            icon: const Icon(Icons.pets),
            tooltip: 'Pet',
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const PetScreen()),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Log out',
            onPressed: () => context.read<AuthState>().logout(),
          ),
        ],
      ),
      body: FutureBuilder<List<BinderPage>>(
        future: _futureBinders,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
                child: Text('Failed to load binders: ${snapshot.error}'));
          }
          final binders = snapshot.data ?? [];
          if (binders.isEmpty) {
            return const Center(
                child: Text('No binders yet. Tap + to create one.'));
          }
          return ListView.builder(
            itemCount: binders.length,
            itemBuilder: (context, index) {
              final binder = binders[index];
              return ListTile(
                title: Text(binder.title),
                subtitle: binder.description != null
                    ? Text(binder.description!)
                    : null,
                trailing: const Icon(Icons.chevron_right),
                onTap: () async {
                  await Navigator.of(context).push(
                    MaterialPageRoute(
                        builder: (_) =>
                            BinderDetailScreen(binderId: binder.id)),
                  );
                  _reload();
                },
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _createBinder,
        child: const Icon(Icons.add),
      ),
    );
  }
}
