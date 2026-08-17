import 'package:flutter/material.dart';
import '../models/pet.dart';
import '../services/pet_service.dart';

class PetScreen extends StatefulWidget {
  const PetScreen({super.key});

  @override
  State<PetScreen> createState() => _PetScreenState();
}

class _PetScreenState extends State<PetScreen> {
  final _service = PetService();
  late Future<Pet> _futurePet;
  bool _feeding = false;

  @override
  void initState() {
    super.initState();
    _futurePet = _service.get();
  }

  Future<void> _feed() async {
    setState(() => _feeding = true);
    try {
      final pet = await _service.feed();
      setState(() => _futurePet = Future.value(pet));
      if (pet.evolved && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${pet.currentPokemon} evolved!')),
        );
      }
    } finally {
      setState(() => _feeding = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Your Pet')),
      body: FutureBuilder<Pet>(
        future: _futurePet,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Failed to load pet: ${snapshot.error}'));
          }
          final pet = snapshot.data!;
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(pet.currentPokemon,
                    style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 8),
                Text('Stage ${pet.stage} · Fed ${pet.feedCount} times'),
                const SizedBox(height: 16),
                SizedBox(
                  width: 240,
                  child: LinearProgressIndicator(value: pet.fullness / 100),
                ),
                const SizedBox(height: 4),
                Text('Fullness: ${pet.fullness.round()}%'),
                if (pet.nextThreshold != null) ...[
                  const SizedBox(height: 4),
                  Text('Next evolution at ${pet.nextThreshold} feeds'),
                ],
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: _feeding ? null : _feed,
                  icon: const Icon(Icons.restaurant),
                  label: const Text('Feed'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
